'use strict';

const generatorHandler = require('../lib/basic-generator-handler');
const iterationService = require('../lib/services/iteration-service');

function* handler(event) {
  const actionId = event.actionId;
  const startTimestamp = event.startTimestamp;
  const entityId = event.entityId;
  const message = event.message;

  yield iterationService.addIterationError(
    actionId,
    startTimestamp,
    entityId,
    message
  );

  return { acknowledged: true };
}

module.exports.handler = generatorHandler(handler);
