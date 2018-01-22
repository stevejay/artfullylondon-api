'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const handlerRunner = require('./handler-runner');
const updatePreferences = require('../../handlers/update-preferences');
const userService = require('../../lib/services/user-service');
const constants = require('../../lib/constants');

const USER_ID = 'email|12345';

describe('update-preferences.handler', () => {
  afterEach(() => {
    userService.updatePreferences.restore &&
      userService.updatePreferences.restore();
  });

  it('should handle a valid request', done => {
    const event = {
      requestContext: { authorizer: { principalId: USER_ID } },
      body: JSON.stringify({
        emailFrequency: constants.EMAIL_FREQUENCY_TYPE_WEEKLY,
      }),
    };

    sinon.stub(userService, 'updatePreferences').callsFake(params => {
      expect(params).to.eql({
        userId: USER_ID,
        preferences: {
          emailFrequency: constants.EMAIL_FREQUENCY_TYPE_WEEKLY,
        },
      });

      return Promise.resolve();
    });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        acknowledged: true,
      },
    };

    handlerRunner(updatePreferences.handler, event, expected, done);
  });
});
