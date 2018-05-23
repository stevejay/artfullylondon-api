"use strict";

const withErrorHandling = require("lambda-error-handler");
const eventSeriesService = require("../../event-series/event-series-service");

async function handler(event) {
  const ids =
    event.queryStringParameters && event.queryStringParameters.ids
      ? decodeURIComponent(event.queryStringParameters.ids).split(",")
      : JSON.parse(event.body).ids;

  const entities = await eventSeriesService.getEventSeriesMulti(ids);
  return { body: entities };
}

exports.handler = withErrorHandling(handler);
