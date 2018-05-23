'use strict';

const generatorHandler = require('../lib/basic-generator-handler');
const iterationService = require('../lib/services/iteration-service');

function* handler(event) {
  yield iterationService.endIteration(event.actionId, event.startTimestamp);
  return { acknowledged: true };
}

exports.handler = generatorHandler(handler);
