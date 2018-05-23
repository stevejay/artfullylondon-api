"use strict";

const generatorHandler = require("../../lambda/generator-handler");
const searchIndexService = require("../../search/search-index-service");

function* handler() {
  yield searchIndexService.refreshEventFullSearch();
  return { acknowledged: true };
}

exports.handler = generatorHandler(handler);
