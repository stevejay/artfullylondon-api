"use strict";

const withErrorHandling = require("lambda-error-handler");
const withWriteAuthorization = require("../../lambda/with-write-authorization");
const eventService = require("../../event/event-service");

async function handler(event) {
  const request = JSON.parse(event.body);
  const pathId = event.pathParameters && event.pathParameters.id;
  const entity = await eventService.createOrUpdateEvent(pathId, request);
  return { body: { entity } };
}

exports.handler = withWriteAuthorization(withErrorHandling(handler));
