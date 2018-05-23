"use strict";

const withErrorHandling = require("lambda-error-handler");
const searchIndexService = require("../../search/search-index-service");

async function handler(event) {
  await Promise.all(
    (event.Records || []).map(record => {
      const eventId = record.Sns ? record.Sns.Message : null;
      return searchIndexService.updateEventSearchIndex(eventId);
    })
  );

  return { body: { acknowledged: true } };
}

exports.handler = withErrorHandling(handler);
