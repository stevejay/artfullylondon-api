'use strict';

const generatorHandler = require('lambda-generator-handler');
const userService = require('../lib/services/user-service');

function* handler(event) {
  const request = {
    entityType: event.pathParameters.entityType,
    userId: event.requestContext.authorizer.principalId,
  };

  return yield userService.getWatches(request);
}

module.exports.handler = generatorHandler(handler);
