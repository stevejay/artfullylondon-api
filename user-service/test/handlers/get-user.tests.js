'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const handlerRunner = require('./handler-runner');
const getUser = require('../../handlers/get-user');
const userService = require('../../lib/services/user-service');

const USER_ID = 'email|12345';

describe('get-user.handler', () => {
  afterEach(() => {
    userService.getAllWatches.restore && userService.getAllWatches.restore();
  });

  it('should handle a valid request', done => {
    const event = {
      requestContext: { authorizer: { principalId: USER_ID } },
    };

    sinon.stub(userService, 'getAllWatches').callsFake(params => {
      expect(params).to.eql({ userId: USER_ID });

      return Promise.resolve([
        {
          id: 'talent/carrie-cracknell-director',
          label: 'Carrie Cracknell',
          created: 700,
        },
      ]);
    });

    const expected = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: {
        watches: [
          {
            id: 'talent/carrie-cracknell-director',
            label: 'Carrie Cracknell',
            created: 700,
          },
        ],
      },
    };

    handlerRunner(getUser.handler, event, expected, done);
  });
});
