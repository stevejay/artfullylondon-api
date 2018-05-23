"use strict";

const generatorHandler = require("../../lambda/generator-handler");
const venueService = require("../../venue/venue-service");
const writeAuthorized = require("../../lambda/lambda-write-authorized-decorator");

function* handler(event) {
  const request = JSON.parse(event.body);
  const pathId = event.pathParameters && event.pathParameters.id;
  const entity = yield venueService.createOrUpdateVenue(pathId, request);
  return { entity };
}

exports.handler = writeAuthorized(generatorHandler(handler));
