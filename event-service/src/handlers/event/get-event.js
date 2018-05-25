"use strict";

const withErrorHandling = require("lambda-error-handler");
const withCacheControl = require("../../lambda/with-cache-control");
const eventService = require("../../event/event-service");

async function handler(event) {
  const id = decodeURIComponent(event.pathParameters.id);
  const entity = await eventService.getEvent(id);
  return { entity };
}

exports.handler = withErrorHandling(withCacheControl(handler, 1800));
