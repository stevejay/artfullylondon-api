import * as notifier from "../notifier";
import * as eventRepository from "../persistence/event-repository";
import * as eventMapper from "../event/mapper";
import * as entityType from "../types/entity-type";
import * as cache from "../cache";

// const LATEST_VERSION = "latest";

export async function updateEventSearchIndex(message) {
  if (!message || !message.eventId) {
    return;
  }

  let dbEvent = await eventRepository.getEvent(message.eventId, true);
  const referencedEntities = await eventRepository.getReferencedEntities(
    dbEvent,
    true
  );
  dbEvent = eventMapper.mergeReferencedEntities(dbEvent, referencedEntities);
  await notifier.indexEntity(eventMapper.mapToPublicFullResponse(dbEvent));
  await cache.clearEntityEtag(entityType.EVENT, dbEvent.id);
}

// const refreshSearchIndexConstraints = {
//   index: {
//     presence: true
//   },
//   version: {
//     format: /^(\d+|latest)$/
//   }
// };

export async function refreshSearchIndex(/*params*/) {
  throw new Error("not implemented");
}

// exports.refreshSearchIndex = async function(params) {
//   ensure(params, refreshSearchIndexConstraints, ensureErrorHandler);

//   // A search index can involve multiple entities.
//   // This lookup is used to get them all.

//   throw new Error("not implemented");
//   const entities = [];
//   // globalConstants.ENTITIES_FOR_SEARCH_INDEX_TYPES[params.index];

//   for (let i = 0; i < entities.length; ++i) {
//     const entity = entities[i];

//     await sns.notify(
//       {
//         index: params.index,
//         version: params.version === LATEST_VERSION ? null : params.version,
//         entity: entity,
//         exclusiveStartKey: null
//       },
//       {
//         arn: process.env.SERVERLESS_REFRESH_SEARCH_INDEX_TOPIC_ARN
//       }
//     );
//   }

//   return { acknowledged: true };
// };

export async function processRefreshSearchIndexMessage(/*message*/) {
  throw new Error("Not implemented");
}

// exports.processRefreshSearchIndexMessage = async function(message) {
//   if (!message) {
//     return;
//   }

//   const startTime = process.hrtime();
//   const entityParams = getEntityParams(message.entity);

//   const scanResult = await dynamodb.scanBasic({
//     TableName: entityParams.tableName,
//     ExclusiveStartKey: message.exclusiveStartKey || null,
//     Limit: 30,
//     ConsistentRead: false
//   });

//   // let entities = null;

//   // if (entityParams.refsGetter) {
//   //   entities = await entityParams.refsGetter(scanResult.Items);
//   // } else {
//   //   entities = scanResult.Items;
//   // }

//   // const isAutocomplete = message.index.endsWith("-auto");
//   // const builder = new EntityBulkUpdateBuilder();

//   // entities.forEach(entity => {
//   //   const indexName =
//   //     message.version && message.version !== "latest"
//   //       ? `${message.index}_v${message.version}`
//   //       : message.index;

//   //   if (isAutocomplete) {
//   //     const autocompleteItem = entityParams.mappings.mapDbItemToAutocompleteSearchIndex(
//   //       entity.entity || entity,
//   //       entity.referencedEntities
//   //     );

//   //     builder.addAutocompleteSearchUpdate(autocompleteItem, indexName);
//   //   } else {
//   //     const fullSearchItem = entityParams.mappings.mapDbItemToFullSearchIndex(
//   //       entity.entity || entity,
//   //       entity.referencedEntities
//   //     );

//   //     builder.addFullSearchUpdate(fullSearchItem, indexName);
//   //   }
//   // });

//   // try {
//   //   const body = builder.build();
//   //   if (body.length) {
//   //     await elasticsearch.bulk({ body });
//   //   }
//   // } catch (err) {
//   //   log.error("elasticsearch errors: " + err.message);
//   //   // swallow exception to allow process to continue.
//   // }

//   const lastEvaluatedKey = scanResult.LastEvaluatedKey;
//   if (lastEvaluatedKey) {
//     // console.log('adding sns for next chunk of messages');

//     const elapsedTime = process.hrtime(startTime);
//     // console.info("Execution time (hr): %ds %dms", elapsedTime[0], elapsedTime[1]/1000000);

//     if (elapsedTime[0] < 1) {
//       // console.log('delaying 1000ms');
//       await delay(1000);
//     }

//     await sns.notify(
//       {
//         index: message.index,
//         version: message.version,
//         entity: message.entity,
//         exclusiveStartKey: lastEvaluatedKey
//       },
//       {
//         arn: process.env.SERVERLESS_REFRESH_SEARCH_INDEX_TOPIC_ARN
//       }
//     );
//   }
// };

// function getEntityParams(entityType) {
//   switch (entityType) {
//     case entityType.EVENT:
//       return {
//         tableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
//         refsGetter: eventPopulate.getReferencedEntitiesForSearch,
//         mappings: eventMappings
//       };
//     case entityType.EVENT_SERIES:
//       return {
//         tableName: process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME,
//         refsGetter: null,
//         mappings: eventSeriesMappings
//       };
//     case entityType.TALENT:
//       return {
//         tableName: process.env.SERVERLESS_TALENT_TABLE_NAME,
//         refsGetter: null,
//         mappings: talentMappings
//       };
//     case entityType.VENUE:
//       return {
//         tableName: process.env.SERVERLESS_VENUE_TABLE_NAME,
//         refsGetter: null,
//         mappings: venueMappings
//       };
//     default:
//       throw new Error(`Unknown entity name: ${entityType}`);
//   }
// }
