'use strict';

const generatorHandler = require('lambda-generator-handler');
const userService = require('../lib/services/user-service');

function* handler(event) {
  const request = {
    userId: event.requestContext.authorizer.principalId,
  };

  const watches = yield userService.getAllWatches(request);
  return { watches };
}

module.exports.handler = generatorHandler(handler);
