"use strict";

const withErrorHandling = require("lambda-error-handler");
const venueService = require("../../venue/venue-service");

async function handler(event) {
  const lastId =
    event.pathParameters && event.pathParameters.lastId
      ? event.pathParameters.lastId
      : event.lastId;

  const result = await venueService.getNextVenue(lastId || null);
  return { body: { venueId: result.Items.length ? result.Items[0].id : null } };
}

exports.handler = withErrorHandling(handler);
