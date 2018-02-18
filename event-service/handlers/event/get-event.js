'use strict';

const cacheControlGeneratorHandler = require('../../lib/lambda/cache-control-generator-handler');
const eventService = require('../../lib/event/event-service');

function* handler(event) {
  const id = event.pathParameters.id;
  const entity = yield eventService.getEvent(id);
  return { entity };
}

module.exports.handler = cacheControlGeneratorHandler(handler, 1800);
