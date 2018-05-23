"use strict";

const generatorHandler = require("../../lambda/generator-handler");
const venueService = require("../../venue/venue-service");

function* handler(event) {
  const ids =
    event.queryStringParameters && event.queryStringParameters.ids
      ? decodeURIComponent(event.queryStringParameters.ids).split(",")
      : JSON.parse(event.body).ids;

  const entities = yield venueService.getVenueMulti(ids);
  return { entities };
}

exports.handler = generatorHandler(handler);
