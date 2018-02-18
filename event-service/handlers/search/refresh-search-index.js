'use strict';

const generatorHandler = require('../../lib/lambda/generator-handler');
const writeAuthorized = require('../../lib/lambda/lambda-write-authorized-decorator');
const searchIndexService = require('../../lib/search/search-index-service');

function* handler(event) {
  const request = {
    index: event.pathParameters.index,
    version: event.pathParameters.version,
  };

  yield searchIndexService.refreshSearchIndex(request);
  return { acknowledged: true };
}

module.exports.handler = writeAuthorized(generatorHandler(handler));
