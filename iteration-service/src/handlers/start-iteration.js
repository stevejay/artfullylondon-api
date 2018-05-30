"use strict";

const withErrorHandling = require("lambda-error-handler");
const iterationService = require("../services/iteration-service");

async function handler(event) {
  const item = await iterationService.startIteration(event.actionId);
  return { body: { startTimestamp: item.startTimestamp } };
}

exports.handler = withErrorHandling(handler);
