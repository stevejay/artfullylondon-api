"use strict";

const generatorHandler = require("../../lambda/generator-handler");
const venueService = require("../../venue/venue-service");

function* handler(event) {
  const id = event.pathParameters.id;
  const entity = yield venueService.getVenueForEdit(id);
  return { entity };
}

exports.handler = generatorHandler(handler);
