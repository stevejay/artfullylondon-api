'use strict';

const generatorHandler = require('../../lib/lambda/generator-handler');
const eventSeriesService = require('../../lib/event-series/event-series-service');

function* handler(event) {
  const id = event.pathParameters.id;
  const entity = yield eventSeriesService.getEventSeriesForEdit(id);
  return { entity };
}

module.exports.handler = generatorHandler(handler);
