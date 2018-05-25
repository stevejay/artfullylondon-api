"use strict";

const withErrorHandling = require("lambda-error-handler");
const withCacheControl = require("../../lambda/with-cache-control");
const eventSeriesService = require("../../event-series/event-series-service");

async function handler(event) {
  const id = event.pathParameters.id;
  const entity = await eventSeriesService.getEventSeries(id);
  return { entity };
}

exports.handler = withErrorHandling(withCacheControl(handler, 1800));
