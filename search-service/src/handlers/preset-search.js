"use strict";

const withErrorHandling = require("lambda-error-handler");
const withCacheControl = require("../with-cache-control");
const searchService = require("../search-service");
const constants = require("../constants");

async function handler(event) {
  const request = {
    name: event.pathParameters.name,
    id: event.queryStringParameters ? event.queryStringParameters.id : null
  };

  return await searchService.presetSearch(request);
}

module.exports.handler = withErrorHandling(
  withCacheControl(handler, constants.CACHE_CONTROL_SECONDS)
);
