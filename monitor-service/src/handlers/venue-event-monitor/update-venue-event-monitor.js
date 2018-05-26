"use strict";

const withErrorHandling = require("lambda-error-handler");
const service = require("../../services/venue-event-monitor-service");

async function handler(event) {
  const request = JSON.parse(event.body);

  const entity = {
    venueId: event.pathParameters.venueId,
    externalEventId: decodeURIComponent(event.pathParameters.externalEventId),
    isIgnored: request.isIgnored,
    hasChanged: request.hasChanged
  };

  await service.updateVenueEventMonitor(entity);
  return { body: { acknowledged: true } };
}

exports.handler = withErrorHandling(handler);
