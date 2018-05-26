"use strict";

const withErrorHandling = require("lambda-error-handler");
const service = require("../services/venue-iteration-service");

async function handler() {
  await service.startIteration();
  return { body: { acknowledged: true } };
}

exports.handler = withErrorHandling(handler);
