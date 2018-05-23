'use strict';

const generatorHandler = require('lambda-generator-handler');
const iterationService = require('../lib/services/iteration-service');

function* handler(event) {
  const actionId = event.pathParameters
    ? event.pathParameters.actionId
    : event.actionId;

  const errors = yield iterationService.getLatestIterationErrors(actionId);
  return { errors };
}

exports.handler = generatorHandler(handler);
