'use strict';

const cacheControlGeneratorHandler = require('../lib/lambda/cache-control-generator-handler');
const searchService = require('../lib/services/search-service');

function* handler(event) {
  const request = {
    name: event.pathParameters.name,
    id: event.queryStringParameters ? event.queryStringParameters.id : null,
  };

  return searchService.presetSearch(request);
}

module.exports.handler = cacheControlGeneratorHandler(handler, 1800);
