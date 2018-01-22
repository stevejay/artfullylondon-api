// 'use strict';

// const expect = require('chai').expect;
// const sinon = require('sinon');
// const dynamoDbClient = require('dynamodb-doc-client-wrapper');
// const handlerRunner = require('./handler-runner');
// const getWatches = require('../../handlers/get-watches');
// const constants = require('../../lib/constants');

// process.env.SERVERLESS_WATCH_TABLE_NAME = 'watch-table';
// const USER_ID = 'email|12345';

// describe('handlers/get-watches', function() {
//   afterEach(function() {
//     dynamoDbClient.getBasic.restore();
//   });

//   it('should return empty watches data when watches do not exist', done => {
//     const event = {
//       requestContext: { authorizer: { principalId: USER_ID } },
//       pathParameters: {
//         entityType: constants.ENTITY_TYPE_TALENT,
//       },
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

//     const expected = {
//       statusCode: 200,
//       headers: {
//         'Access-Control-Allow-Credentials': true,
//         'Access-Control-Allow-Origin': '*',
//       },
//       body: {
//         entityType: constants.ENTITY_TYPE_TALENT,
//         version: constants.INITIAL_VERSION_NUMBER,
//         items: [],
//       },
//     };

//     handlerRunner(getWatches.handler, event, expected, done);
//   });

//   it('should get existing watches', done => {
//     const event = {
//       requestContext: { authorizer: { principalId: USER_ID } },
//       pathParameters: {
//         entityType: constants.ENTITY_TYPE_TALENT,
//       },
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
//           version: 2,
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
//       });
//     });

//     const expected = {
//       statusCode: 200,
//       headers: {
//         'Access-Control-Allow-Credentials': true,
//         'Access-Control-Allow-Origin': '*',
//       },
//       body: {
//         entityType: constants.ENTITY_TYPE_TALENT,
//         version: 2,
//         items: [
//           {
//             id: 'talent/carrie-cracknell-director',
//             label: 'Carrie Cracknell',
//             created: 700,
//           },
//           {
//             id: 'talent/philipe-parreno-artist',
//             label: 'Philipe Parreno',
//             created: 800,
//           },
//         ],
//       },
//     };

//     handlerRunner(getWatches.handler, event, expected, done);
//   });
// });
