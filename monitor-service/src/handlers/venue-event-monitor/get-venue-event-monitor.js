"use strict";

const withErrorHandling = require("lambda-error-handler");
const service = require("../../services/venue-event-monitor-service");

async function handler(event) {
  const venueId = event.pathParameters.venueId;

  const externalEventId = decodeURIComponent(
    event.pathParameters.externalEventId
  );

  const dbItem = await service.getVenueEventMonitor(venueId, externalEventId);
  return { body: { entity: dbItem } };
}

exports.handler = withErrorHandling(handler);
