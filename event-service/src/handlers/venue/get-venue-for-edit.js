"use strict";

const withErrorHandling = require("lambda-error-handler");
const venueService = require("../../venue/venue-service");

async function handler(event) {
  const id = event.pathParameters.id;
  const entity = await venueService.getVenueForEdit(id);
  return { body: { entity } };
}

exports.handler = withErrorHandling(handler);
