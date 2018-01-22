'use strict';

const cacheControlGeneratorHandler = require('../lib/lambda/cache-control-generator-handler');
const mappings = require('../lib/data/mappings');
const searchService = require('../lib/services/search-service');

function* handler(event) {
  const request = mappings.mapBasicSearchHandlerDataToRequest(event);
  const isPublic = event.resource.startsWith('/public/');
  return searchService.basicSearch(request, isPublic);
}

module.exports.handler = cacheControlGeneratorHandler(handler, 1800);
