"use strict";

const withErrorHandling = require("lambda-error-handler");
const eventSeriesService = require("../../event-series/event-series-service");

async function handler(event) {
  const id = event.pathParameters.id;
  const entity = await eventSeriesService.getEventSeriesForEdit(id);
  return { body: { entity } };
}

exports.handler = withErrorHandling(handler);
