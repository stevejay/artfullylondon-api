"use strict";

const withErrorHandling = require("lambda-error-handler");
const venueService = require("../../venue/venue-service");

async function handler(event) {
  const result = await venueService.getNextVenue(event.lastId);
  return { body: { venueId: result.Items.length ? result.Items[0].id : null } };
}

exports.handler = withErrorHandling(handler);
