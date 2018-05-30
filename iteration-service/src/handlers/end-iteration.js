"use strict";

const withErrorHandling = require("lambda-error-handler");
const iterationService = require("../services/iteration-service");

async function handler(event) {
  await iterationService.endIteration(event.actionId, event.startTimestamp);
  return { body: { acknowledged: true } };
}

exports.handler = withErrorHandling(handler);
