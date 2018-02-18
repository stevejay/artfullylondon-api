'use strict';

const generatorHandler = require('lambda-generator-handler');
const service = require('../../lib/services/venue-monitor-service');

function* handler(event) {
  const venueId = event.pathParameters.venueId;
  const dbItems = yield service.getVenueMonitors(venueId);
  return { items: dbItems };
}

module.exports.handler = generatorHandler(handler);
