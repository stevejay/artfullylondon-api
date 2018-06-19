"use strict";

const _ = require("lodash");
const delay = require("delay");
// const log = require("loglevel");
const ensure = require("ensure-request").ensure;
const sns = require("../external-services/sns");
const dynamodb = require("../external-services/dynamodb");
const entity = require("../entity/entity");
const globalConstants = require("../constants");
const ensureErrorHandler = require("../data/ensure-error-handler");
const eventMappings = require("../event/mappings");
const eventSeriesMappings = require("../event-series/mappings");
const talentMappings = require("../talent/mappings");
const venueMappings = require("../venue/mappings");
const eventPopulate = require("../event/populate");
const etag = require("../lambda/etag");

exports.updateEventSearchIndex = async function(message) {
  if (!message || !message.eventId) {
    return;
  }

  const dbItem = await entity.get(
    process.env.SERVERLESS_EVENT_TABLE_NAME,
    message.eventId,
    true
  );

  const referencedEntities = await eventPopulate.getReferencedEntities(dbItem, {
    ConsistentRead: true
  });

  await sns.notify(
    {
      entityType: globalConstants.ENTITY_TYPE_EVENT,
      entity: {
        ...dbItem,
        venue: _.pick(referencedEntities, "venue[0]"),
        eventSeries: _.pick(referencedEntities, "eventSeries[0]"),
        talent: _.pick(referencedEntities, "talent")
      }
    },
    { arn: process.env.SERVERLESS_INDEX_DOCUMENT_TOPIC_ARN }
  );

  const publicResponse = eventMappings.mapDbItemToPublicResponse(
    dbItem,
    referencedEntities
  );

  await etag.writeETagToRedis(
    "event/" + message.eventId,
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

  return { acknowledged: true };
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

  // let entities = null;

  // if (entityParams.refsGetter) {
  //   entities = await entityParams.refsGetter(scanResult.Items);
  // } else {
  //   entities = scanResult.Items;
  // }

  // const isAutocomplete = message.index.endsWith("-auto");
  // const builder = new EntityBulkUpdateBuilder();

  // entities.forEach(entity => {
  //   const indexName =
  //     message.version && message.version !== "latest"
  //       ? `${message.index}_v${message.version}`
  //       : message.index;

  //   if (isAutocomplete) {
  //     const autocompleteItem = entityParams.mappings.mapDbItemToAutocompleteSearchIndex(
  //       entity.entity || entity,
  //       entity.referencedEntities
  //     );

  //     builder.addAutocompleteSearchUpdate(autocompleteItem, indexName);
  //   } else {
  //     const fullSearchItem = entityParams.mappings.mapDbItemToFullSearchIndex(
  //       entity.entity || entity,
  //       entity.referencedEntities
  //     );

  //     builder.addFullSearchUpdate(fullSearchItem, indexName);
  //   }
  // });

  // try {
  //   const body = builder.build();
  //   if (body.length) {
  //     await elasticsearch.bulk({ body });
  //   }
  // } catch (err) {
  //   log.error("elasticsearch errors: " + err.message);
  //   // swallow exception to allow process to continue.
  // }

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
