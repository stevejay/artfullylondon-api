'use strict';

const generatorHandler = require('../../lib/lambda/generator-handler');
const searchIndexService = require('../../lib/services/search-index-service');

function* handler(event) {
  yield (event.Records || []).map(function*(record) {
    const message = JSON.parse(record.Sns.Message);
    yield searchIndexService.processRefreshSearchIndexMessage(message);
  });

  return { acknowledged: true };
}

module.exports.handler = generatorHandler(handler);
