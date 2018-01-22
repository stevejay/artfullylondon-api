'use strict';

const generatorHandler = require('../../lib/lambda/generator-handler');
const writeAuthorized = require('../../lib/lambda/lambda-write-authorized-decorator');
const eventService = require('../../lib/services/event-service');

function* handler(event) {
  const request = JSON.parse(event.body);
  const pathId = event.pathParameters && event.pathParameters.id;
  const entity = yield eventService.createOrUpdateEvent(pathId, request);
  return { entity };
}

module.exports.handler = writeAuthorized(generatorHandler(handler));
