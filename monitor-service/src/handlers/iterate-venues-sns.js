"use strict";

const withErrorHandling = require("lambda-error-handler");
const venueService = require("../services/venue-service");

async function handler(event) {
  await Promise.all((event.Records || []).map(record => processRecord(record)));
  return { body: { acknowledged: true } };
}

async function processRecord(record) {
  const message = JSON.parse(record.Sns.Message);

  if (!message) {
    return;
  }

  await venueService.processNextVenue(
    message.lastId,
    message.startTimestamp,
    280000
  );
}

exports.handler = withErrorHandling(handler);
