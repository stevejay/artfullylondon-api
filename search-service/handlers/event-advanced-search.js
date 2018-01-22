'use strict';

const cacheControlGeneratorHandler = require('../lib/lambda/cache-control-generator-handler');
const mappings = require('../lib/data/mappings');
const searchService = require('../lib/services/search-service');

function* handler(event) {
  const request = mappings.mapEventFullSearchHandlerDataToRequest(event);
  return searchService.eventAdvancedSearch(request);
}

module.exports.handler = cacheControlGeneratorHandler(handler, 1800);
