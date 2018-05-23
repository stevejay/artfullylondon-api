"use strict";

const generatorHandler = require("../../lambda/generator-handler");
const writeAuthorized = require("../../lambda/lambda-write-authorized-decorator");
const eventService = require("../../event/event-service");

function* handler(event) {
  const request = JSON.parse(event.body);
  const pathId = event.pathParameters && event.pathParameters.id;
  const entity = yield eventService.createOrUpdateEvent(pathId, request);
  return { entity };
}

exports.handler = writeAuthorized(generatorHandler(handler));
