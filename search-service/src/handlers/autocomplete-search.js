"use strict";

const withErrorHandling = require("lambda-error-handler");
const withCacheControl = require("../with-cache-control");
const mappings = require("../domain/mappings");
const searchService = require("../search-service");
const constants = require("../constants");

async function handler(event) {
  const request = mappings.mapAutocompleteSearchHandlerDataToRequest(event);
  const items = await searchService.autocompleteSearch(request);
  return { items, params: request };
}

module.exports.handler = withErrorHandling(
  withCacheControl(handler, constants.CACHE_CONTROL_SECONDS)
);
