"use strict";

const searchIndexService = require("../../search/search-index-service");

async function handler(event, context, callback) {
  try {
    await Promise.all(
      (event.Records || []).map(record => {
        const eventId = record.Sns ? record.Sns.Message : null;
        return searchIndexService.updateEventSearchIndex(eventId);
      })
    );

    callback(null, "Success");
  } catch (err) {
    callback(err);
  }
}

exports.handler = handler;
