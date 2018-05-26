"use strict";

const withErrorHandling = require("lambda-error-handler");
const service = require("../../services/venue-event-monitor-service");

async function handler(event) {
  const venueId = event.pathParameters.venueId;
  const items = await service.getVenueEventMonitorsForVenue(venueId);
  return { body: { venueId, items } };
}

exports.handler = withErrorHandling(handler);
