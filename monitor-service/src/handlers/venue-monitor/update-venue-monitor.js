"use strict";

const withErrorHandling = require("lambda-error-handler");
const service = require("../../services/venue-monitor-service");

async function handler(event) {
  const request = JSON.parse(event.body);

  const entity = {
    venueId: event.pathParameters.venueId,
    isIgnored: request.isIgnored,
    hasChanged: request.hasChanged
  };

  await service.updateVenueMonitor(entity);
  return { body: { acknowledged: true } };
}

exports.handler = withErrorHandling(handler);
