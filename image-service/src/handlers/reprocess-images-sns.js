"use strict";

const withErrorHandling = require("lambda-error-handler");
const imageService = require("../services/image-service");

async function handler(event) {
  await Promise.all[(event.Records || []).map(record => processRecord(record))];
  return { body: { acknowledged: true } };
}

async function processRecord(record) {
  const message = JSON.parse(record.Sns.Message);

  if (!message) {
    return;
  }

  await imageService.reprocessNextImage(message.lastId, message.startTimestamp);
}

exports.handler = withErrorHandling(handler);
