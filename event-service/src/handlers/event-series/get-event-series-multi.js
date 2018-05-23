"use strict";

const generatorHandler = require("../../lambda/generator-handler");
const eventSeriesService = require("../../event-series/event-series-service");

function* handler(event) {
  const ids =
    event.queryStringParameters && event.queryStringParameters.ids
      ? decodeURIComponent(event.queryStringParameters.ids).split(",")
      : JSON.parse(event.body).ids;

  const entities = yield eventSeriesService.getEventSeriesMulti(ids);
  return { entities };
}

exports.handler = generatorHandler(handler);
