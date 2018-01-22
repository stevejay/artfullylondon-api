'use strict';

const generatorHandler = require('../../lib/lambda/generator-handler');
const venueService = require('../../lib/services/venue-service');

function* handler(event) {
  const ids = event.queryStringParameters && event.queryStringParameters.ids
    ? decodeURIComponent(event.queryStringParameters.ids).split(',')
    : JSON.parse(event.body).ids;

  const entities = yield venueService.getVenueMulti(ids);
  return { entities };
}

module.exports.handler = generatorHandler(handler);
