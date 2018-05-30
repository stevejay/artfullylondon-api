"use strict";

const withErrorHandling = require("lambda-error-handler");
const iterationService = require("../services/iteration-service");

async function handler(event) {
  const actionId = event.pathParameters
    ? event.pathParameters.actionId
    : event.actionId;

  const errors = await iterationService.getLatestIterationErrors(actionId);
  return { body: { errors } };
}

exports.handler = withErrorHandling(handler);
