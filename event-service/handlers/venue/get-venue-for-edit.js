'use strict';

const generatorHandler = require('../../lib/lambda/generator-handler');
const venueService = require('../../lib/venue/venue-service');

function* handler(event) {
  const id = event.pathParameters.id;
  const entity = yield venueService.getVenueForEdit(id);
  return { entity };
}

module.exports.handler = generatorHandler(handler);
