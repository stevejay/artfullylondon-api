'use strict';

const generatorHandler = require('../../lib/lambda/generator-handler');
const eventSeriesService = require('../../lib/event-series/event-series-service');

function* handler(event) {
  const ids = event.queryStringParameters && event.queryStringParameters.ids
    ? decodeURIComponent(event.queryStringParameters.ids).split(',')
    : JSON.parse(event.body).ids;

  const entities = yield eventSeriesService.getEventSeriesMulti(ids);
  return { entities };
}

module.exports.handler = generatorHandler(handler);
