'use strict';

const generatorHandler = require('../../lib/lambda/generator-handler');
const venueService = require('../../lib/venue/venue-service');
const writeAuthorized = require('../../lib/lambda/lambda-write-authorized-decorator');

function* handler(event) {
  const request = JSON.parse(event.body);
  const pathId = event.pathParameters && event.pathParameters.id;
  const entity = yield venueService.createOrUpdateVenue(pathId, request);
  return { entity };
}

module.exports.handler = writeAuthorized(generatorHandler(handler));
