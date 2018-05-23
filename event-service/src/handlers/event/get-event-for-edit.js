"use strict";

const generatorHandler = require("../../lambda/generator-handler");
const eventService = require("../../event/event-service");

function* handler(event) {
  const id = event.pathParameters.id;
  const entity = yield eventService.getEventForEdit(id);
  return { entity };
}

exports.handler = generatorHandler(handler);
