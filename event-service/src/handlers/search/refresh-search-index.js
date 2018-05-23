"use strict";

const generatorHandler = require("../../lambda/generator-handler");
const writeAuthorized = require("../../lambda/lambda-write-authorized-decorator");
const searchIndexService = require("../../search/search-index-service");

function* handler(event) {
  const request = {
    index: event.pathParameters.index,
    version: event.pathParameters.version
  };

  yield searchIndexService.refreshSearchIndex(request);
  return { acknowledged: true };
}

exports.handler = writeAuthorized(generatorHandler(handler));
