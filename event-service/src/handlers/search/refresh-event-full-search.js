"use strict";

const withErrorHandling = require("lambda-error-handler");
const searchIndexService = require("../../search/search-index-service");

async function handler() {
  const request = { index: "event-full", version: "latest" };
  await searchIndexService.refreshSearchIndex(request);
  return { body: { acknowledged: true } };
}

exports.handler = withErrorHandling(handler);
