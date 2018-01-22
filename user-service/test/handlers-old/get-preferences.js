// 'use strict';

// const expect = require('chai').expect;
// const sinon = require('sinon');
// const dynamoDbClient = require('dynamodb-doc-client-wrapper');
// const handlerRunner = require('./handler-runner');
// const getPreferences = require('../../handlers/get-preferences');
// const constants = require('../../lib/constants');

// process.env.SERVERLESS_PREFERENCES_TABLE_NAME = 'preferences-table';
// const USER_ID = 'email|12345';

// describe('handlers/get-preferences', function() {
//   afterEach(function() {
//     dynamoDbClient.getBasic.restore();
//   });

//   it('should return default preferences data when preferences do not exist', done => {
//     const event = {
//       requestContext: { authorizer: { principalId: USER_ID } },
//     };

//     sinon.stub(dynamoDbClient, 'getBasic').callsFake(params => {
//       expect(params).to.eql({
//         TableName: process.env.SERVERLESS_PREFERENCES_TABLE_NAME,
//         Key: { userId: USER_ID },
//         ProjectionExpression: 'emailFrequency',
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
//         preferences: {
//           emailFrequency: constants.EMAIL_FREQUENCY_TYPE_DAILY,
//         },
//       },
//     };

//     handlerRunner(getPreferences.handler, event, expected, done);
//   });

//   it('should get existing preferences', done => {
//     const event = {
//       requestContext: { authorizer: { principalId: USER_ID } },
//     };

//     sinon.stub(dynamoDbClient, 'getBasic').callsFake(params => {
//       expect(params).to.eql({
//         TableName: process.env.SERVERLESS_PREFERENCES_TABLE_NAME,
//         Key: { userId: USER_ID },
//         ProjectionExpression: 'emailFrequency',
//         ReturnConsumedCapacity: undefined,
//       });

//       return Promise.resolve({
//         Item: {
//           emailFrequency: constants.EMAIL_FREQUENCY_TYPE_WEEKLY,
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
//         preferences: {
//           emailFrequency: constants.EMAIL_FREQUENCY_TYPE_WEEKLY,
//         },
//       },
//     };

//     handlerRunner(getPreferences.handler, event, expected, done);
//   });
// });
