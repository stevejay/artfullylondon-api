'use strict';

const cacheControlGeneratorHandler = require('../../lib/lambda/cache-control-generator-handler');
const entityLib = require('../../lib/entity/entity');
const eventSeriesService = require('../../lib/services/event-series-service');

function* handler(event) {
  const isPublicRequest = entityLib.isPublicRequest(event);
  const id = event.pathParameters.id;
  const entity = yield eventSeriesService.getEventSeries(id, isPublicRequest);
  return { entity };
}

module.exports.handler = cacheControlGeneratorHandler(handler, 1800);
