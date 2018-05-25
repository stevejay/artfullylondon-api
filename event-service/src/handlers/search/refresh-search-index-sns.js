"use strict";

const log = require("loglevel");
const searchIndexService = require("../../search/search-index-service");

async function handler(event, context, callback) {
  try {
    await Promise.all(
      (event.Records || []).map(record => {
        const message = JSON.parse(record.Sns.Message);
        return searchIndexService.processRefreshSearchIndexMessage(message);
      })
    );

    callback(null, "Success");
  } catch (err) {
    log.error(`Error in refresh-search-index-sns: ${err.message}`);
    callback(err);
  }
}

exports.handler = handler;
