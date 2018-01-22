// 'use strict';

// const expect = require('chai').expect;
// const sinon = require('sinon');
// const log = require('loglevel');
// const dynamoDbClient = require('dynamodb-doc-client-wrapper');
// const handlerRunner = require('./handler-runner');
// const updateWatches = require('../../handlers/update-watches');
// const constants = require('../../lib/constants');

// process.env.SERVERLESS_WATCH_TABLE_NAME = 'watch-table';
// const USER_ID = 'email|12345';

// describe('handlers/update-watches', function() {
//   beforeEach(() => {
//     sinon.stub(log, 'error').callsFake(() => {});
//   });

//   afterEach(function() {
//     if (dynamoDbClient.getBasic.restore) {
//       dynamoDbClient.getBasic.restore();
//     }

//     if (dynamoDbClient.put.restore) {
//       dynamoDbClient.put.restore();
//     }

//     log.error.restore && log.error.restore();
//   });

//   it('should handle update to non-existent watches with no additions or deletions', done => {
//     const event = {
//       requestContext: { authorizer: { principalId: USER_ID } },
//       pathParameters: {
//         entityType: constants.ENTITY_TYPE_TALENT,
//       },
//       body: JSON.stringify({
//         newVersion: 1,
//         changes: [],
//       }),
//     };

//     sinon.stub(dynamoDbClient, 'getBasic').callsFake(params => {
//       expect(params).to.eql({
//         TableName: process.env.SERVERLESS_WATCH_TABLE_NAME,
//         Key: { userId: USER_ID, entityType: constants.ENTITY_TYPE_TALENT },
//         ProjectionExpression: 'version, #items',
//         ExpressionAttributeNames: { '#items': 'items' },
//         ReturnConsumedCapacity: undefined,
//       });

//       return Promise.resolve({ Item: null });
//     });

//     sinon.stub(dynamoDbClient, 'put').callsFake(params => {
//       expect(params).to.eql({
//         TableName: process.env.SERVERLESS_WATCH_TABLE_NAME,
//         Item: {
//           userId: USER_ID,
//           entityType: constants.ENTITY_TYPE_TALENT,
//           version: 1,
//           items: [],
//         },
//         ConditionExpression:
//           'attribute_not_exists(userId) and attribute_not_exists(entityType)',
//         ReturnConsumedCapacity: undefined,
//       });

//       return Promise.resolve();
//     });

//     const expected = {
//       statusCode: 200,
//       headers: {
//         'Access-Control-Allow-Credentials': true,
//         'Access-Control-Allow-Origin': '*',
//       },
//       body: { acknowledged: true },
//     };

//     handlerRunner(updateWatches.handler, event, expected, done);
//   });

//   it('should handle update to existing watches with no additions or deletions', done => {
//     const event = {
//       requestContext: { authorizer: { principalId: USER_ID } },
//       pathParameters: {
//         entityType: constants.ENTITY_TYPE_TALENT,
//       },
//       body: JSON.stringify({
//         newVersion: 4,
//         changes: [],
//       }),
//     };

//     sinon.stub(dynamoDbClient, 'getBasic').callsFake(params => {
//       expect(params).to.eql({
//         TableName: process.env.SERVERLESS_WATCH_TABLE_NAME,
//         Key: { userId: USER_ID, entityType: constants.ENTITY_TYPE_TALENT },
//         ProjectionExpression: 'version, #items',
//         ExpressionAttributeNames: { '#items': 'items' },
//         ReturnConsumedCapacity: undefined,
//       });

//       return Promise.resolve({
//         Item: {
//           version: 3,
//           items: [
//             {
//               id: 'talent/carrie-cracknell-director',
//               label: 'Carrie Cracknell',
//               created: 700,
//             },
//           ],
//         },
//       });
//     });

//     sinon.stub(dynamoDbClient, 'put').callsFake(params => {
//       expect(params).to.eql({
//         TableName: process.env.SERVERLESS_WATCH_TABLE_NAME,
//         Item: {
//           userId: USER_ID,
//           entityType: constants.ENTITY_TYPE_TALENT,
//           version: 4,
//           items: [
//             {
//               id: 'talent/carrie-cracknell-director',
//               label: 'Carrie Cracknell',
//               created: 700,
//             },
//           ],
//         },
//         ConditionExpression:
//           'attribute_exists(userId) and attribute_exists(entityType) and version = :oldVersion',
//         ExpressionAttributeValues: { ':oldVersion': 3 },
//         ReturnConsumedCapacity: undefined,
//       });

//       return Promise.resolve();
//     });

//     const expected = {
//       statusCode: 200,
//       headers: {
//         'Access-Control-Allow-Credentials': true,
//         'Access-Control-Allow-Origin': '*',
//       },
//       body: { acknowledged: true },
//     };

//     handlerRunner(updateWatches.handler, event, expected, done);
//   });

//   it('should throw stale data exception when request has wrong version number and there are no existing watches', done => {
//     const event = {
//       requestContext: { authorizer: { principalId: USER_ID } },
//       pathParameters: {
//         entityType: constants.ENTITY_TYPE_TALENT,
//       },
//       body: JSON.stringify({
//         newVersion: 2,
//         changes: [],
//       }),
//     };

//     sinon.stub(dynamoDbClient, 'getBasic').callsFake(params => {
//       expect(params).to.eql({
//         TableName: process.env.SERVERLESS_WATCH_TABLE_NAME,
//         Key: { userId: USER_ID, entityType: constants.ENTITY_TYPE_TALENT },
//         ProjectionExpression: 'version, #items',
//         ExpressionAttributeNames: { '#items': 'items' },
//         ReturnConsumedCapacity: undefined,
//       });

//       return Promise.resolve({ Item: null });
//     });

//     sinon.stub(dynamoDbClient, 'put').callsFake(() => {
//       return Promise.reject(new Error('put should not have been invoked'));
//     });

//     const expected = {
//       statusCode: 400,
//       headers: {
//         'Access-Control-Allow-Credentials': true,
//         'Access-Control-Allow-Origin': '*',
//       },
//       body: { error: '[400] Stale data' },
//     };

//     handlerRunner(updateWatches.handler, event, expected, done);
//   });

//   it('should throw stale data exception when request has wrong version number and there is existing watches', done => {
//     const event = {
//       requestContext: { authorizer: { principalId: USER_ID } },
//       pathParameters: {
//         entityType: constants.ENTITY_TYPE_TALENT,
//       },
//       body: JSON.stringify({
//         newVersion: 1,
//         changes: [],
//       }),
//     };

//     sinon.stub(dynamoDbClient, 'getBasic').callsFake(params => {
//       expect(params).to.eql({
//         TableName: process.env.SERVERLESS_WATCH_TABLE_NAME,
//         Key: { userId: USER_ID, entityType: constants.ENTITY_TYPE_TALENT },
//         ProjectionExpression: 'version, #items',
//         ExpressionAttributeNames: { '#items': 'items' },
//         ReturnConsumedCapacity: undefined,
//       });

//       return Promise.resolve({
//         Item: {
//           version: 3,
//           items: [
//             {
//               id: 'talent/carrie-cracknell-director',
//               label: 'Carrie Cracknell',
//               created: 700,
//             },
//           ],
//         },
//       });
//     });

//     sinon.stub(dynamoDbClient, 'put').callsFake(() => {
//       return Promise.reject(new Error('put should not have been invoked'));
//     });

//     const expected = {
//       statusCode: 400,
//       headers: {
//         'Access-Control-Allow-Credentials': true,
//         'Access-Control-Allow-Origin': '*',
//       },
//       body: { error: '[400] Stale data' },
//     };

//     handlerRunner(updateWatches.handler, event, expected, done);
//   });

//   it('should handle update to existing watches with additions and deletions', done => {
//     const event = {
//       requestContext: { authorizer: { principalId: USER_ID } },
//       pathParameters: {
//         entityType: constants.ENTITY_TYPE_TALENT,
//       },
//       body: JSON.stringify({
//         newVersion: 4,
//         changes: [
//           {
//             changeType: 'add',
//             id: 'talent/philipe-parreno-artist',
//             label: 'Philipe Parreno',
//             created: 800,
//           },
//           { changeType: 'delete', id: 'talent/carrie-cracknell-director' },
//           { changeType: 'delete', id: 'talent/non-existent-actor' },
//         ],
//       }),
//     };

//     sinon.stub(dynamoDbClient, 'getBasic').callsFake(params => {
//       expect(params).to.eql({
//         TableName: process.env.SERVERLESS_WATCH_TABLE_NAME,
//         Key: { userId: USER_ID, entityType: constants.ENTITY_TYPE_TALENT },
//         ProjectionExpression: 'version, #items',
//         ExpressionAttributeNames: { '#items': 'items' },
//         ReturnConsumedCapacity: undefined,
//       });

//       return Promise.resolve({
//         Item: {
//           version: 3,
//           items: [
//             {
//               id: 'talent/carrie-cracknell-director',
//               label: 'Carrie Cracknell',
//               created: 700,
//             },
//           ],
//         },
//       });
//     });

//     sinon.stub(dynamoDbClient, 'put').callsFake(params => {
//       expect(params).to.eql({
//         TableName: process.env.SERVERLESS_WATCH_TABLE_NAME,
//         Item: {
//           userId: USER_ID,
//           entityType: constants.ENTITY_TYPE_TALENT,
//           version: 4,
//           items: [
//             {
//               id: 'talent/philipe-parreno-artist',
//               label: 'Philipe Parreno',
//               created: 800,
//             },
//           ],
//         },
//         ConditionExpression:
//           'attribute_exists(userId) and attribute_exists(entityType) and version = :oldVersion',
//         ExpressionAttributeValues: { ':oldVersion': 3 },
//         ReturnConsumedCapacity: undefined,
//       });

//       return Promise.resolve();
//     });

//     const expected = {
//       statusCode: 200,
//       headers: {
//         'Access-Control-Allow-Credentials': true,
//         'Access-Control-Allow-Origin': '*',
//       },
//       body: { acknowledged: true },
//     };

//     handlerRunner(updateWatches.handler, event, expected, done);
//   });

//   it('should apply additions and deletions in list order', done => {
//     const event = {
//       requestContext: { authorizer: { principalId: USER_ID } },
//       pathParameters: {
//         entityType: constants.ENTITY_TYPE_TALENT,
//       },
//       body: JSON.stringify({
//         newVersion: 4,
//         changes: [
//           { changeType: 'delete', id: 'talent/philipe-parreno-artist' },
//           {
//             changeType: 'add',
//             id: 'talent/philipe-parreno-artist',
//             label: 'Philipe Parreno',
//             created: 800,
//           },
//         ],
//       }),
//     };

//     sinon.stub(dynamoDbClient, 'getBasic').callsFake(params => {
//       expect(params).to.eql({
//         TableName: process.env.SERVERLESS_WATCH_TABLE_NAME,
//         Key: { userId: USER_ID, entityType: constants.ENTITY_TYPE_TALENT },
//         ProjectionExpression: 'version, #items',
//         ExpressionAttributeNames: { '#items': 'items' },
//         ReturnConsumedCapacity: undefined,
//       });

//       return Promise.resolve({
//         Item: {
//           version: 3,
//           items: [
//             {
//               id: 'talent/carrie-cracknell-director',
//               label: 'Carrie Cracknell',
//               created: 700,
//             },
//           ],
//         },
//       });
//     });

//     sinon.stub(dynamoDbClient, 'put').callsFake(params => {
//       expect(params).to.eql({
//         TableName: process.env.SERVERLESS_WATCH_TABLE_NAME,
//         Item: {
//           userId: USER_ID,
//           entityType: constants.ENTITY_TYPE_TALENT,
//           version: 4,
//           items: [
//             {
//               id: 'talent/carrie-cracknell-director',
//               label: 'Carrie Cracknell',
//               created: 700,
//             },
//             {
//               id: 'talent/philipe-parreno-artist',
//               label: 'Philipe Parreno',
//               created: 800,
//             },
//           ],
//         },
//         ConditionExpression:
//           'attribute_exists(userId) and attribute_exists(entityType) and version = :oldVersion',
//         ExpressionAttributeValues: { ':oldVersion': 3 },
//         ReturnConsumedCapacity: undefined,
//       });

//       return Promise.resolve();
//     });

//     const expected = {
//       statusCode: 200,
//       headers: {
//         'Access-Control-Allow-Credentials': true,
//         'Access-Control-Allow-Origin': '*',
//       },
//       body: { acknowledged: true },
//     };

//     handlerRunner(updateWatches.handler, event, expected, done);
//   });

//   it('should throw validation exception when has zero version number', done => {
//     const event = {
//       requestContext: { authorizer: { principalId: USER_ID } },
//       pathParameters: {
//         entityType: constants.ENTITY_TYPE_TALENT,
//       },
//       body: JSON.stringify({
//         newVersion: 0,
//         changes: [],
//       }),
//     };

//     sinon.stub(dynamoDbClient, 'getBasic').callsFake(() => {
//       return Promise.reject(new Error('getBasic should not have been invoked'));
//     });

//     sinon.stub(dynamoDbClient, 'put').callsFake(() => {
//       return Promise.reject(new Error('put should not have been invoked'));
//     });

//     const expected = {
//       statusCode: 400,
//       headers: {
//         'Access-Control-Allow-Credentials': true,
//         'Access-Control-Allow-Origin': '*',
//       },
//       body: { error: '[400] Bad Request: New Version is not greater than 0' },
//     };

//     handlerRunner(updateWatches.handler, event, expected, done);
//   });
// });
