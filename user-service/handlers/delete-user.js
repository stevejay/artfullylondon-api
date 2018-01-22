'use strict';

const generatorHandler = require('lambda-generator-handler');
const userService = require('../lib/services/user-service');

function* handler(event) {
  const request = {
    userId: event.requestContext.authorizer.principalId,
  };

  yield userService.deleteUser(request);
  return { acknowledged: true };
}

module.exports.handler = generatorHandler(handler);
