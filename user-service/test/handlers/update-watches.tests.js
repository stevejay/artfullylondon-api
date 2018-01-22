'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const handlerRunner = require('./handler-runner');
const updateWatches = require('../../handlers/update-watches');
const userService = require('../../lib/services/user-service');

const USER_ID = 'email|12345';

describe('update-watches.handler', () => {
  afterEach(() => {
    userService.updateWatches.restore && userService.updateWatches.restore();
  });

  it('should handle a valid request', done => {
    const event = {
      requestContext: { authorizer: { principalId: USER_ID } },
      pathParameters: { entityType: 'talent' },
      body: JSON.stringify({
        newVersion: 4,
        changes: [],
      }),
    };

    sinon.stub(userService, 'updateWatches').callsFake(params => {
      expect(params).to.eql({
        userId: USER_ID,
        entityType: 'talent',
        newVersion: 4,
        changes: [],
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

    handlerRunner(updateWatches.handler, event, expected, done);
  });
});
