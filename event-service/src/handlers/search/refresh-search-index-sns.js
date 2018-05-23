"use strict";

const withErrorHandling = require("lambda-error-handler");
const searchIndexService = require("../../search/search-index-service");

async function handler(event) {
  await Promise.all(
    (event.Records || []).map(record => {
      const message = JSON.parse(record.Sns.Message);
      return searchIndexService.processRefreshSearchIndexMessage(message);
    })
  );

  return { body: { acknowledged: true } };
}

exports.handler = withErrorHandling(handler);
