"use strict";

const delay = require("delay");
const log = require("loglevel");
const ensure = require("ensure-request").ensure;
const sns = require("../external-services/sns");
const dynamodb = require("../external-services/dynamodb");
const elasticsearch = require("../external-services/elasticsearch");
const EntityBulkUpdateBuilder = require("../entity/entity-bulk-update-builder");
const globalConstants = require("../constants");
const ensureErrorHandler = require("../data/ensure-error-handler");
const eventMappings = require("../event/mappings");
const eventSeriesMappings = require("../event-series/mappings");
const talentMappings = require("../talent/mappings");
const venueMappings = require("../venue/mappings");
const eventPopulate = require("../event/populate");
const etag = require("../lambda/etag");

exports.updateEventSearchIndex = async function(eventId) {
  if (!eventId) {
    return;
  }

  const dbItem = await dynamodb.get({
    TableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
    Key: { id: eventId },
    ConsistentRead: true,
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

  const referencedEntities = await eventPopulate.getReferencedEntities(dbItem, {
    ConsistentRead: true
  });

  const fullSearchItem = eventMappings.mapDbItemToFullSearchIndex(
    dbItem,
    referencedEntities
  );

  const autocompleteItem = eventMappings.mapDbItemToAutocompleteSearchIndex(
    dbItem,
    referencedEntities
  );

  const builder = new EntityBulkUpdateBuilder()
    .addFullSearchUpdate(
      fullSearchItem,
      globalConstants.SEARCH_INDEX_TYPE_EVENT_FULL
    )
    .addAutocompleteSearchUpdate(
      autocompleteItem,
      globalConstants.SEARCH_INDEX_TYPE_COMBINED_EVENT_AUTO
    );

  await elasticsearch.bulk({ body: builder.build() });

  const publicResponse = eventMappings.mapDbItemToPublicResponse(
    dbItem,
    referencedEntities
  );

  await etag.writeETagToRedis(
    "event/" + eventId,
    JSON.stringify({ entity: publicResponse })
  );
};

const refreshSearchIndexConstraints = {
  index: {
    presence: true,
    inclusion: globalConstants.ALLOWED_SEARCH_INDEX_TYPES
  },
  version: {
    format: /^(\d+|latest)$/
  }
};

const LATEST_VERSION = "latest";

exports.refreshSearchIndex = async function(params) {
  ensure(params, refreshSearchIndexConstraints, ensureErrorHandler);

  // A search index can involve multiple entities.
  // This lookup is used to get them all.
  const entities =
    globalConstants.ENTITIES_FOR_SEARCH_INDEX_TYPES[params.index];

  for (let i = 0; i < entities.length; ++i) {
    const entity = entities[i];

    await sns.notify(
      {
        index: params.index,
        version: params.version === LATEST_VERSION ? null : params.version,
        entity: entity,
        exclusiveStartKey: null
      },
      {
        arn: process.env.SERVERLESS_REFRESH_SEARCH_INDEX_TOPIC_ARN
      }
    );
  }
};

exports.processRefreshSearchIndexMessage = async function(message) {
  if (!message) {
    return;
  }

  const startTime = process.hrtime();
  const entityParams = getEntityParams(message.entity);

  const scanResult = await dynamodb.scanBasic({
    TableName: entityParams.tableName,
    ExclusiveStartKey: message.exclusiveStartKey || null,
    Limit: globalConstants.REFRESH_SEARCH_INDEX_MAX_TAKE_PER_SCAN,
    ConsistentRead: false
  });

  let entities = null;

  if (entityParams.refsGetter) {
    entities = await entityParams.refsGetter(scanResult.Items);
  } else {
    entities = scanResult.Items;
  }

  const isAutocomplete = message.index.endsWith("-auto");
  const builder = new EntityBulkUpdateBuilder();

  entities.forEach(entity => {
    const indexName =
      message.version && message.version !== "latest"
        ? `${message.index}_v${message.version}`
        : message.index;

    if (isAutocomplete) {
      const autocompleteItem = entityParams.mappings.mapDbItemToAutocompleteSearchIndex(
        entity.entity || entity,
        entity.referencedEntities
      );

      builder.addAutocompleteSearchUpdate(autocompleteItem, indexName);
    } else {
      const fullSearchItem = entityParams.mappings.mapDbItemToFullSearchIndex(
        entity.entity || entity,
        entity.referencedEntities
      );

      builder.addFullSearchUpdate(fullSearchItem, indexName);
    }
  });

  try {
    const body = builder.build();
    if (body.length) {
      await elasticsearch.bulk({ body });
    }
  } catch (err) {
    log.error("elasticsearch errors: " + err.message);
    // swallow exception to allow process to continue.
  }

  const lastEvaluatedKey = scanResult.LastEvaluatedKey;
  if (lastEvaluatedKey) {
    // console.log('adding sns for next chunk of messages');

    const elapsedTime = process.hrtime(startTime);
    // console.info("Execution time (hr): %ds %dms", elapsedTime[0], elapsedTime[1]/1000000);

    if (elapsedTime[0] < 1) {
      // console.log('delaying 1000ms');
      await delay(1000);
    }

    await sns.notify(
      {
        index: message.index,
        version: message.version,
        entity: message.entity,
        exclusiveStartKey: lastEvaluatedKey
      },
      {
        arn: process.env.SERVERLESS_REFRESH_SEARCH_INDEX_TOPIC_ARN
      }
    );
  }
};

function getEntityParams(entityType) {
  switch (entityType) {
    case globalConstants.ENTITY_TYPE_EVENT:
      return {
        tableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
        refsGetter: eventPopulate.getReferencedEntitiesForSearch,
        mappings: eventMappings
      };
    case globalConstants.ENTITY_TYPE_EVENT_SERIES:
      return {
        tableName: process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME,
        refsGetter: null,
        mappings: eventSeriesMappings
      };
    case globalConstants.ENTITY_TYPE_TALENT:
      return {
        tableName: process.env.SERVERLESS_TALENT_TABLE_NAME,
        refsGetter: null,
        mappings: talentMappings
      };
    case globalConstants.ENTITY_TYPE_VENUE:
      return {
        tableName: process.env.SERVERLESS_VENUE_TABLE_NAME,
        refsGetter: null,
        mappings: venueMappings
      };
    default:
      throw new Error(`Unknown entity name: ${entityType}`);
  }
}
