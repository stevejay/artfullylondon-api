"use strict";

const withErrorHandling = require("lambda-error-handler");
const eventService = require("../../event/event-service");

async function handler(event) {
  const id = event.pathParameters.id;
  const entity = await eventService.getEventForEdit(id);
  return { body: entity };
}

exports.handler = withErrorHandling(handler);
