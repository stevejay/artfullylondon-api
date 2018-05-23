"use strict";

const cacheControlGeneratorHandler = require("../../lambda/cache-control-generator-handler");
const eventSeriesService = require("../../event-series/event-series-service");

function* handler(event) {
  const id = event.pathParameters.id;
  const entity = yield eventSeriesService.getEventSeries(id);
  return { entity };
}

exports.handler = cacheControlGeneratorHandler(handler, 1800);
