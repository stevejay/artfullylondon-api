'use strict';

const generatorHandler = require('lambda-generator-handler');
const service = require('../../lib/services/venue-monitor-service');

function* handler(event) {
  const request = JSON.parse(event.body);

  const entity = {
    venueId: event.pathParameters.venueId,
    isIgnored: request.isIgnored,
    hasChanged: request.hasChanged,
  };

  yield service.updateVenueMonitor(entity);
  return { acknowledged: true };
}

exports.handler = generatorHandler(handler);
