"use strict";

const withErrorHandling = require("lambda-error-handler");
const withWriteAuthorization = require("../lambda/with-write-authorization");
const searchIndexService = require("../../search/search-index-service");

async function handler(event) {
  const request = {
    index: event.pathParameters.index,
    version: event.pathParameters.version
  };

  await searchIndexService.refreshSearchIndex(request);
  return { body: { acknowledged: true } };
}

exports.handler = withWriteAuthorization(withErrorHandling(handler));
