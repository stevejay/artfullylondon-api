"use strict";

const cacheControlGeneratorHandler = require("../../lambda/cache-control-generator-handler");
const eventService = require("../../event/event-service");

function* handler(event) {
  const id = event.pathParameters.id;
  const entity = yield eventService.getEvent(id);
  return { entity };
}

exports.handler = cacheControlGeneratorHandler(handler, 1800);
