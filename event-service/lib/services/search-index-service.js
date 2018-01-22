'use strict';

const co = require('co');
const delay = require('delay');
const log = require('loglevel');
const dynamoDbClient = require('dynamodb-doc-client-wrapper');
const ensure = require('ensure-request').ensure;
const sns = require('../external-services/sns');
const elasticsearch = require('../external-services/elasticsearch');
const EntityBulkUpdateBuilder = require('../entity/entity-bulk-update-builder');
const globalConstants = require('../constants');
const ensureErrorHandler = require('../data/ensure-error-handler');
const eventMappings = require('../event/mappings');
const eventSeriesMappings = require('../event-series/mappings');
const talentMappings = require('../talent/mappings');
const venueMappings = require('../venue/mappings');
const eventPopulate = require('../event/populate');
const etag = require('../lambda/etag');

module.exports.updateEventSearchIndex = co.wrap(function*(eventId) {
  if (!eventId) {
    return;
  }

  const dbItem = yield dynamoDbClient.get({
    TableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
    Key: { id: eventId },
    ConsistentRead: true,
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });

  const referencedEntities = yield eventPopulate.getReferencedEntities(dbItem, {
    ConsistentRead: true,
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

  yield elasticsearch.bulk({ body: builder.build() });

  const publicResponse = eventMappings.mapDbItemToPublicResponse(
    dbItem,
    referencedEntities
  );

  yield etag.writeETagToRedis(
    'event/' + eventId,
    JSON.stringify({ entity: publicResponse })
  );
});

module.exports.refreshEventFullSearch = co.wrap(function*() {
  yield sns.notify(
    {
      index: 'event-full',
      version: 'latest',
      entity: 'event',
      exclusiveStartKey: null,
    },
    {
      arn: process.env.SERVERLESS_REFRESH_SEARCH_INDEX_TOPIC_ARN,
    }
  );
});

const refreshSearchIndexConstraints = {
  index: {
    presence: true,
    inclusion: globalConstants.ALLOWED_SEARCH_INDEX_TYPES,
  },
  version: {
    format: /^(\d+|latest)$/,
  },
};

const LATEST_VERSION = 'latest';

module.exports.refreshSearchIndex = co.wrap(function*(params) {
  ensure(params, refreshSearchIndexConstraints, ensureErrorHandler);

  // A search index can involve multiple entities.
  // This lookup is used to get them all.
  const entities =
    globalConstants.ENTITIES_FOR_SEARCH_INDEX_TYPES[params.index];

  for (let i = 0; i < entities.length; ++i) {
    const entity = entities[i];

    yield sns.notify(
      {
        index: params.index,
        version: params.version === LATEST_VERSION ? null : params.version,
        entity: entity,
        exclusiveStartKey: null,
      },
      {
        arn: process.env.SERVERLESS_REFRESH_SEARCH_INDEX_TOPIC_ARN,
      }
    );
  }
});

module.exports.processRefreshSearchIndexMessage = co.wrap(function*(message) {
  if (!message) {
    return;
  }

  const startTime = process.hrtime();
  const entityParams = getEntityParams(message.entity);

  const scanResult = yield dynamoDbClient.scanBasic({
    TableName: entityParams.tableName,
    ExclusiveStartKey: message.exclusiveStartKey || null,
    Limit: globalConstants.REFRESH_SEARCH_INDEX_MAX_TAKE_PER_SCAN,
    ConsistentRead: false,
  });

  let entities = null;

  if (entityParams.refsGetter) {
    entities = yield entityParams.refsGetter(scanResult.Items);
  } else {
    entities = scanResult.Items;
  }

  const isAutocomplete = message.index.endsWith('-auto');
  const builder = new EntityBulkUpdateBuilder();

  entities.forEach(entity => {
    const indexName =
      message.version && message.version !== 'latest'
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
    yield elasticsearch.bulk({ body: builder.build() });
  } catch (err) {
    log.error('elasticsearch errors: ' + err.message);
    // swallow exception to allow process to continue.
  }

  const lastEvaluatedKey = scanResult.LastEvaluatedKey;
  if (lastEvaluatedKey) {
    // console.log('adding sns for next chunk of messages');

    const elapsedTime = process.hrtime(startTime);
    // console.info("Execution time (hr): %ds %dms", elapsedTime[0], elapsedTime[1]/1000000);

    if (elapsedTime[0] < 1) {
      // console.log('delaying 1000ms');
      yield delay(1000);
    }

    yield sns.notify(
      {
        index: message.index,
        version: message.version,
        entity: message.entity,
        exclusiveStartKey: lastEvaluatedKey,
      },
      {
        arn: process.env.SERVERLESS_REFRESH_SEARCH_INDEX_TOPIC_ARN,
      }
    );
  }
});

function getEntityParams(entityType) {
  switch (entityType) {
    case globalConstants.ENTITY_TYPE_EVENT:
      return {
        tableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
        refsGetter: eventPopulate.getReferencedEntitiesForSearch,
        mappings: eventMappings,
      };
    case globalConstants.ENTITY_TYPE_EVENT_SERIES:
      return {
        tableName: process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME,
        refsGetter: null,
        mappings: eventSeriesMappings,
      };
    case globalConstants.ENTITY_TYPE_TALENT:
      return {
        tableName: process.env.SERVERLESS_TALENT_TABLE_NAME,
        refsGetter: null,
        mappings: talentMappings,
      };
    case globalConstants.ENTITY_TYPE_VENUE:
      return {
        tableName: process.env.SERVERLESS_VENUE_TABLE_NAME,
        refsGetter: null,
        mappings: venueMappings,
      };
    default:
      throw new Error(`Unknown entity name: ${entityType}`);
  }
}
