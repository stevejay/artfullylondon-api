"use strict";

const withErrorHandling = require("lambda-error-handler");
const eventService = require("../../event/event-service");

async function handler(event) {
  const ids =
    event.queryStringParameters && event.queryStringParameters.ids
      ? decodeURIComponent(event.queryStringParameters.ids).split(",")
      : JSON.parse(event.body).ids;

  const entities = await eventService.getEventMulti(ids);
  return { body: entities };
}

exports.handler = withErrorHandling(handler);
