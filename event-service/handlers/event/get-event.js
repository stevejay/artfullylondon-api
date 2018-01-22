'use strict';

const cacheControlGeneratorHandler = require('../../lib/lambda/cache-control-generator-handler');
const entityLib = require('../../lib/entity/entity');
const eventService = require('../../lib/services/event-service');

function* handler(event) {
  const isPublicRequest = entityLib.isPublicRequest(event);
  const id = event.pathParameters.id;
  const entity = yield eventService.getEvent(id, isPublicRequest);
  return { entity };
}

module.exports.handler = cacheControlGeneratorHandler(handler, 1800);
