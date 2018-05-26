"use strict";

const withErrorHandling = require("lambda-error-handler");
const service = require("../../services/venue-monitor-service");

async function handler(event) {
  const venueId = event.pathParameters.venueId;
  const dbItems = await service.getVenueMonitors(venueId);
  return { body: { items: dbItems } };
}

exports.handler = withErrorHandling(handler);
