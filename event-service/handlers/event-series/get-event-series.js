'use strict';

const cacheControlGeneratorHandler = require('../../lib/lambda/cache-control-generator-handler');
const eventSeriesService = require('../../lib/event-series/event-series-service');

function* handler(event) {
  const id = event.pathParameters.id;
  const entity = yield eventSeriesService.getEventSeries(id);
  return { entity };
}

module.exports.handler = cacheControlGeneratorHandler(handler, 1800);
