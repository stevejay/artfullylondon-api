'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const handlerRunner = require('./handler-runner');
const getPreferences = require('../../handlers/get-preferences');
const userService = require('../../lib/services/user-service');
const constants = require('../../lib/constants');

const USER_ID = 'email|12345';

describe('get-preferences.handler', () => {
  afterEach(() => {
    userService.getPreferences.restore && userService.getPreferences.restore();
  });

  it('should handle a valid request', done => {
    const event = {
      requestContext: { authorizer: { principalId: USER_ID } },
    };

    sinon.stub(userService, 'getPreferences').callsFake(params => {
      expect(params).to.eql({ userId: USER_ID });

      return Promise.resolve({
        emailFrequency: constants.EMAIL_FREQUENCY_TYPE_DAILY,
      });
    });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        preferences: {
          emailFrequency: constants.EMAIL_FREQUENCY_TYPE_DAILY,
        },
      },
    };

    handlerRunner(getPreferences.handler, event, expected, done);
  });
});
