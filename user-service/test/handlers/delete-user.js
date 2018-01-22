'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const handlerRunner = require('./handler-runner');
const deleteUser = require('../../handlers/delete-user');
const userService = require('../../lib/services/user-service');

const USER_ID = 'email|12345';

describe('delete-user.handler', () => {
  afterEach(() => {
    userService.deleteUser.restore && userService.deleteUser.restore();
  });

  it('should handle a valid request', done => {
    const event = {
      requestContext: { authorizer: { principalId: USER_ID } },
    };

    sinon.stub(userService, 'deleteUser').callsFake(params => {
      expect(params).to.eql({ userId: USER_ID });
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

    handlerRunner(deleteUser.handler, event, expected, done);
  });
});
