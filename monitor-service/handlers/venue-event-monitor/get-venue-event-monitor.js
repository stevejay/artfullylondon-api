'use strict';

const generatorHandler = require('lambda-generator-handler');
const service = require('../../lib/services/venue-event-monitor-service');

function* handler(event) {
  const venueId = event.pathParameters.venueId;

  const externalEventId = decodeURIComponent(
    event.pathParameters.externalEventId
  );

  const dbItem = yield service.getVenueEventMonitor(venueId, externalEventId);
  return { entity: dbItem };
}

module.exports.handler = generatorHandler(handler);
