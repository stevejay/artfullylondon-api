"use strict";

const withErrorHandling = require("lambda-error-handler");
const withWriteAuthorization = require("../../lambda/with-write-authorization");
const eventSeriesService = require("../../event-series/event-series-service");

async function handler(event) {
  const request = JSON.parse(event.body);
  const pathId = event.pathParameters && event.pathParameters.id;

  const entity = await eventSeriesService.createOrUpdateEventSeries(
    pathId,
    request
  );

  return { body: { entity } };
}

exports.handler = withWriteAuthorization(withErrorHandling(handler));
