'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const handlerRunner = require('./handler-runner');
const getWatches = require('../../handlers/get-watches');
const userService = require('../../lib/services/user-service');

const USER_ID = 'email|12345';

describe('get-watches.handler', () => {
  afterEach(() => {
    userService.getWatches.restore && userService.getWatches.restore();
  });

  it('should handle a valid request', done => {
    const event = {
      requestContext: { authorizer: { principalId: USER_ID } },
      pathParameters: { entityType: 'talent' },
    };

    sinon.stub(userService, 'getWatches').callsFake(params => {
      expect(params).to.eql({ userId: USER_ID, entityType: 'talent' });

      return Promise.resolve({
        entityType: 'talent',
        version: 200,
        items: [
          {
            id: 'talent/carrie-cracknell-director',
            label: 'Carrie Cracknell',
            created: 700,
          },
        ],
      });
    });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        entityType: 'talent',
        version: 200,
        items: [
          {
            id: 'talent/carrie-cracknell-director',
            label: 'Carrie Cracknell',
            created: 700,
          },
        ],
      },
    };

    handlerRunner(getWatches.handler, event, expected, done);
  });
});
