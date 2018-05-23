"use strict";

const generatorHandler = require("../../lambda/generator-handler");
const searchIndexService = require("../../search/search-index-service");

function* handler(event) {
  yield (event.Records || []).map(function*(record) {
    const message = JSON.parse(record.Sns.Message);
    yield searchIndexService.processRefreshSearchIndexMessage(message);
  });

  return { acknowledged: true };
}

exports.handler = generatorHandler(handler);
