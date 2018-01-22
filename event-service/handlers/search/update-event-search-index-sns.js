'use strict';

const generatorHandler = require('../../lib/lambda/generator-handler');
const searchIndexService = require('../../lib/services/search-index-service');

function* handler(event) {
  yield (event.Records || []).map(record => processRecord(record));
  return { acknowledged: true };
}

function* processRecord(record) {
  const eventId = record.Sns ? record.Sns.Message : null;
  yield searchIndexService.updateEventSearchIndex(eventId);
}

module.exports.handler = generatorHandler(handler);
