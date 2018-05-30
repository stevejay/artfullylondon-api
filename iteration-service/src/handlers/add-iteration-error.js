"use strict";

const withErrorHandling = require("lambda-error-handler");
const iterationService = require("../services/iteration-service");

async function handler(event) {
  const actionId = event.actionId;
  const startTimestamp = event.startTimestamp;
  const entityId = event.entityId;
  const message = event.message;

  await iterationService.addIterationError(
    actionId,
    startTimestamp,
    entityId,
    message
  );

  return { body: { acknowledged: true } };
}

exports.handler = withErrorHandling(handler);
