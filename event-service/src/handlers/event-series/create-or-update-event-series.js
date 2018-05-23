"use strict";

const generatorHandler = require("../../lambda/generator-handler");
const writeAuthorized = require("../../lambda/lambda-write-authorized-decorator");
const eventSeriesService = require("../../event-series/event-series-service");

function* handler(event) {
  const request = JSON.parse(event.body);
  const pathId = event.pathParameters && event.pathParameters.id;

  const entity = yield eventSeriesService.createOrUpdateEventSeries(
    pathId,
    request
  );

  return { entity };
}

exports.handler = writeAuthorized(generatorHandler(handler));
