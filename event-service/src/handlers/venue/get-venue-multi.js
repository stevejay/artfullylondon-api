"use strict";

const withErrorHandling = require("lambda-error-handler");
const venueService = require("../../venue/venue-service");

async function handler(event) {
  const ids =
    event.queryStringParameters && event.queryStringParameters.ids
      ? decodeURIComponent(event.queryStringParameters.ids).split(",")
      : JSON.parse(event.body).ids;

  const entities = await venueService.getVenueMulti(ids);
  return { body: { entities } };
}

exports.handler = withErrorHandling(handler);
