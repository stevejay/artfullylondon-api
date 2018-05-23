"use strict";

const generatorHandler = require("../../lambda/generator-handler");
const eventSeriesService = require("../../event-series/event-series-service");

function* handler(event) {
  const id = event.pathParameters.id;
  const entity = yield eventSeriesService.getEventSeriesForEdit(id);
  return { entity };
}

exports.handler = generatorHandler(handler);
