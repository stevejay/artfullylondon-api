'use strict';

const generatorHandler = require('../../lib/lambda/generator-handler');
const searchIndexService = require('../../lib/services/search-index-service');

function* handler() {
  yield searchIndexService.refreshEventFullSearch();
  return { acknowledged: true };
}

module.exports.handler = generatorHandler(handler);
