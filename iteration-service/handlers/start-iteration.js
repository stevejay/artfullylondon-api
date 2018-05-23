'use strict';

const generatorHandler = require('../lib/basic-generator-handler');
const iterationService = require('../lib/services/iteration-service');

function* handler(event) {
  const item = yield iterationService.startIteration(event.actionId);
  return { startTimestamp: item.startTimestamp };
}

exports.handler = generatorHandler(handler);
