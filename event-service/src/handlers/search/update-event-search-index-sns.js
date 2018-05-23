"use strict";

const generatorHandler = require("../../lambda/generator-handler");
const searchIndexService = require("../../search/search-index-service");

function* handler(event) {
  yield (event.Records || []).map(record => processRecord(record));
  return { acknowledged: true };
}

function* processRecord(record) {
  const eventId = record.Sns ? record.Sns.Message : null;
  yield searchIndexService.updateEventSearchIndex(eventId);
}

exports.handler = generatorHandler(handler);
