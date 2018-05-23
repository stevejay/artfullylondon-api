"use strict";

const cacheControlGeneratorHandler = require("../../lambda/cache-control-generator-handler");
const venueService = require("../../venue/venue-service");

function* handler(event) {
  const id = event.pathParameters.id;
  const entity = yield venueService.getVenue(id);
  return { entity };
}

exports.handler = cacheControlGeneratorHandler(handler, 1800);
