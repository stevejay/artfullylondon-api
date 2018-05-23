'use strict';

const generatorHandler = require('lambda-generator-handler');
const venueService = require('../lib/services/venue-service');

function* handler(event) {
  yield (event.Records || []).map(record => processRecord(record));
  return { acknowledged: true };
}

function* processRecord(record) {
  const message = JSON.parse(record.Sns.Message);

  if (!message) {
    return;
  }

  yield venueService.processNextVenue(
    message.lastId,
    message.startTimestamp,
    280000
  );
}

exports.handler = generatorHandler(handler);
