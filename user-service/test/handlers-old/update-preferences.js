// 'use strict';

// const expect = require('chai').expect;
// const sinon = require('sinon');
// const dynamoDbClient = require('dynamodb-doc-client-wrapper');
// const handlerRunner = require('./handler-runner');
// const updatePreferences = require('../../handlers/update-preferences');
// const constants = require('../../lib/constants');

// process.env.SERVERLESS_PREFERENCES_TABLE_NAME = 'preferences-table';
// const USER_ID = 'email|12345';

// describe('handlers/update-preferences', function() {
//   afterEach(function() {
//     dynamoDbClient.put.restore();
//   });

//   it('should return default preferences data when preferences do not exist', done => {
//     const event = {
//       requestContext: { authorizer: { principalId: USER_ID } },
//       body: JSON.stringify({
//         emailFrequency: constants.EMAIL_FREQUENCY_TYPE_WEEKLY,
//       }),
//     };

//     sinon.stub(dynamoDbClient, 'put').callsFake(params => {
//       expect(params).to.eql({
//         TableName: process.env.SERVERLESS_PREFERENCES_TABLE_NAME,
//         Key: { userId: USER_ID },
//         Item: {
//           userId: USER_ID,
//           emailFrequency: constants.EMAIL_FREQUENCY_TYPE_WEEKLY,
//         },
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

//     handlerRunner(updatePreferences.handler, event, expected, done);
//   });
// });
