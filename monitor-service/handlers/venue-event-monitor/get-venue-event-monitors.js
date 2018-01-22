'use strict';

const generatorHandler = require('lambda-generator-handler');
const service = require('../../lib/services/venue-event-monitor-service');

function* handler(event) {
  const venueId = event.pathParameters.venueId;
  const items = yield service.getVenueEventMonitorsForVenue(venueId);
  return { venueId, items };
}

module.exports.handler = generatorHandler(handler);
