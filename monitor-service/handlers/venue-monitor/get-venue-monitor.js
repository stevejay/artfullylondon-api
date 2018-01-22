'use strict';

const generatorHandler = require('lambda-generator-handler');
const service = require('../../lib/services/venue-monitor-service');

function* handler(event) {
  const venueId = event.pathParameters.venueId;
  const dbItem = yield service.getVenueMonitor(venueId);
  return { entity: dbItem };
}

module.exports.handler = generatorHandler(handler);
