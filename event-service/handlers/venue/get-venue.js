'use strict';

const cacheControlGeneratorHandler = require('../../lib/lambda/cache-control-generator-handler');
const venueService = require('../../lib/venue/venue-service');

function* handler(event) {
  const id = event.pathParameters.id;
  const entity = yield venueService.getVenue(id);
  return { entity };
}

module.exports.handler = cacheControlGeneratorHandler(handler, 1800);
