'use strict';

const generatorHandler = require('../../lib/lambda/generator-handler');
const eventService = require('../../lib/event/event-service');

function* handler(event) {
  const id = event.pathParameters.id;
  const entity = yield eventService.getEventForEdit(id);
  return { entity };
}

module.exports.handler = generatorHandler(handler);
