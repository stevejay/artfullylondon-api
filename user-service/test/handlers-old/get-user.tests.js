// 'use strict';

// const sinon = require('sinon');
// const dynamoDbClient = require('dynamodb-doc-client-wrapper');
// const handlerRunner = require('./handler-runner');
// const getUser = require('../../handlers/get-user');
// const constants = require('../../lib/constants');

// process.env.SERVERLESS_WATCH_TABLE_NAME = 'watch-table';
// const USER_ID = 'email|12345';

// describe('handlers/get-user', function() {
//   afterEach(function() {
//     dynamoDbClient.query.restore();
//   });

//   it('should return empty watches data when watches do not exist', done => {
//     const event = {
//       requestContext: { authorizer: { principalId: USER_ID } },
//     };

//     sinon.stub(dynamoDbClient, 'query').callsFake(() => {
//       return Promise.resolve([]);
//     });

//     const expected = {
//       statusCode: 200,
//       headers: {
//         'Access-Control-Allow-Credentials': true,
//         'Access-Control-Allow-Origin': '*',
//       },
//       body: {
//         watches: [
//           {
//             entityType: constants.ENTITY_TYPE_TAG,
//             version: constants.INITIAL_VERSION_NUMBER,
//             items: [],
//           },
//           {
//             entityType: constants.ENTITY_TYPE_TALENT,
//             version: constants.INITIAL_VERSION_NUMBER,
//             items: [],
//           },
//           {
//             entityType: constants.ENTITY_TYPE_VENUE,
//             version: constants.INITIAL_VERSION_NUMBER,
//             items: [],
//           },
//           {
//             entityType: constants.ENTITY_TYPE_EVENT,
//             version: constants.INITIAL_VERSION_NUMBER,
//             items: [],
//           },
//           {
//             entityType: constants.ENTITY_TYPE_EVENT_SERIES,
//             version: constants.INITIAL_VERSION_NUMBER,
//             items: [],
//           },
//         ],
//       },
//     };

//     handlerRunner(getUser.handler, event, expected, done);
//   });

//   it('should return watches data when watches exist', done => {
//     const event = {
//       requestContext: { authorizer: { principalId: USER_ID } },
//     };

//     sinon.stub(dynamoDbClient, 'query').callsFake(() => {
//       return Promise.resolve([
//         {
//           entityType: constants.ENTITY_TYPE_TALENT,
//           version: 5,
//           items: [],
//         },
//       ]);
//     });

//     const expected = {
//       statusCode: 200,
//       headers: {
//         'Access-Control-Allow-Credentials': true,
//         'Access-Control-Allow-Origin': '*',
//       },
//       body: {
//         watches: [
//           {
//             entityType: constants.ENTITY_TYPE_TALENT,
//             version: 5,
//             items: [],
//           },
//           {
//             entityType: constants.ENTITY_TYPE_TAG,
//             version: 0,
//             items: [],
//           },
//           {
//             entityType: constants.ENTITY_TYPE_VENUE,
//             version: 0,
//             items: [],
//           },
//           {
//             entityType: constants.ENTITY_TYPE_EVENT,
//             version: 0,
//             items: [],
//           },
//           {
//             entityType: constants.ENTITY_TYPE_EVENT_SERIES,
//             version: 0,
//             items: [],
//           },
//         ],
//       },
//     };

//     handlerRunner(getUser.handler, event, expected, done);
//   });
// });
