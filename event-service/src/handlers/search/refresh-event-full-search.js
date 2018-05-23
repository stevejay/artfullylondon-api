"use strict";

const withErrorHandling = require("lambda-error-handler");
const searchIndexService = require("../../search/search-index-service");

async function handler() {
  await searchIndexService.refreshEventFullSearch();
  return { body: { acknowledged: true } };
}

exports.handler = withErrorHandling(handler);
