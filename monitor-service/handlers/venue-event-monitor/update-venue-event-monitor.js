'use strict';

const generatorHandler = require('lambda-generator-handler');
const service = require('../../lib/services/venue-event-monitor-service');

function* handler(event) {
  const request = JSON.parse(event.body);

  const entity = {
    venueId: event.pathParameters.venueId,
    externalEventId: decodeURIComponent(event.pathParameters.externalEventId),
    isIgnored: request.isIgnored,
    hasChanged: request.hasChanged,
  };

  yield service.updateVenueEventMonitor(entity);
  return { acknowledged: true };
}

exports.handler = generatorHandler(handler);
