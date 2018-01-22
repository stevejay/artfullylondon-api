'use strict';

const generatorHandler = require('lambda-generator-handler');
const userService = require('../lib/services/user-service');

function* handler(event) {
  const request = {
    userId: event.requestContext.authorizer.principalId,
    preferences: JSON.parse(event.body),
  };

  yield userService.updatePreferences(request);
  return { acknowledged: true };
}

module.exports.handler = generatorHandler(handler);
