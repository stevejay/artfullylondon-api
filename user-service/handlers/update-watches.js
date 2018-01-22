'use strict';

const generatorHandler = require('lambda-generator-handler');
const userService = require('../lib/services/user-service');

function* handler(event) {
  const body = JSON.parse(event.body);

  const request = {
    userId: event.requestContext.authorizer.principalId,
    entityType: event.pathParameters.entityType,
    newVersion: body.newVersion,
    changes: body.changes,
  };

  yield userService.updateWatches(request);
  return { acknowledged: true };
}

module.exports.handler = generatorHandler(handler);
