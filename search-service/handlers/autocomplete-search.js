'use strict';

const cacheControlGeneratorHandler = require('../lib/lambda/cache-control-generator-handler');
const mappings = require('../lib/data/mappings');
const searchService = require('../lib/services/search-service');

function* handler(event) {
  const request = mappings.mapAutocompleteSearchHandlerDataToRequest(event);
  const items = yield searchService.autocompleteSearch(request);
  return { items, params: request };
}

module.exports.handler = cacheControlGeneratorHandler(handler, 1800);
