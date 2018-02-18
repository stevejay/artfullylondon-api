'use strict';

const generatorHandler = require('../../lib/lambda/generator-handler');
const eventService = require('../../lib/event/event-service');

function* handler(event) {
  const ids = event.queryStringParameters && event.queryStringParameters.ids
    ? decodeURIComponent(event.queryStringParameters.ids).split(',')
    : JSON.parse(event.body).ids;

  const entities = yield eventService.getEventMulti(ids);
  return { entities };
}

module.exports.handler = generatorHandler(handler);
