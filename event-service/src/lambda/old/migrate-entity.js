// 'use strict';

// const ensure = require('ensure-request').ensure;
// const mappings = require('./lib/talent/mappings');
// const talentConstants = require('./lib/talent/constants');
// const venueConstants = require('./lib/venue/constants');
// const eventConstants = require('./lib/event/constants');
// const talentMigration = require('./lib/talent/migration');

// exports.handler = function(event, context, cb) {
//     const input = {
//         entityType: event.path.type
//     };

//     co(function*() {
//         const entityParams = getEntityTypeParams(input.entityType);
//         const previousSchemeVersion = entityParams.currentSchemeVersion - 1;

//         const talentBySchemeVersionParams = {
//             TableName: entityParams.tableName,
//             IndexName: entityParams.schemeVersionIndexName,
//             Limit: 1,
//             KeyConditionExpression: 'schemeVersion = :oldSchemeVersion',
//             ExpressionAttributeValues: {
//                 ':oldSchemeVersion': previousSchemeVersion
//             }
//         };

//         const result = yield dynamodb.query(talentBySchemeVersionParams);
//         let item = null;

//         if (result.Items.length) {
//             const id = result.Items[0].id;
//             item = yield dynamodb.get(entityParams.tableName, { id: id });
//         }

//         if (item && item.schemeVersion === previousSchemeVersion) {
//             item = yield entityParams.migrator(input.entityType, item);

//             item.version = item.version + 1;
//             item.schemeVersion = entityParams.currentSchemeVersion;

//             const putEntityParams = {
//                 TableName: entityParams.tableName,
//                 Item: item,
//                 ConditionExpression: 'attribute_exists(id) and version = :version',
//                 ExpressionAttributeValues: { ':version': item.version - 1 }
//             };

//             yield dynamodb.put(putEntityParams);
//         }

//         cb(null, { finished: !item, item: item ? { id: item.id } : null });
//     }).catch(err => errorHandler(cb, err));
// };

// function getEntityTypeParams(entityType) {
//     switch (entityType) {
//     case 'talent':
//         return {
//             currentSchemeVersion: talentConstants.CURRENT_TALENT_SCHEME_VERSION,
//             tableName: process.env.SERVERLESS_TALENT_TABLE_NAME,
//             schemeVersionIndexName: process.env.SERVERLESS_TALENT_BY_SCHEME_VERSION_INDEX_NAME,
//             migrator: talentMigration.migrator
//         };
//     case 'venue':
//         return {
//             currentSchemeVersion: venueConstants.CURRENT_VENUE_SCHEME_VERSION,
//             tableName: process.env.SERVERLESS_VENUE_TABLE_NAME,
//             schemeVersionIndexName: process.env.SERVERLESS_VENUE_BY_SCHEME_VERSION_INDEX_NAME,
//             migrator: talentMigration.migrator
//         };
//     case 'event':
//         return {
//             currentSchemeVersion: eventConstants.CURRENT_EVENT_SCHEME_VERSION,
//             tableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
//             schemeVersionIndexName: process.env.SERVERLESS_EVENT_BY_SCHEME_VERSION_INDEX_NAME,
//             migrator: talentMigration.migrator
//         };
//     default:
//         throw new Error(`entityType out of range: ${entityType}`);
//     }
// }
