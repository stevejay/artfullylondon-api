"use strict";

require("../aws-cloudwatch-retry");
const withErrorHandling = require("lambda-error-handler");
const tagService = require("../tag-service");

async function handler() {
  const result = await tagService.getAllTags();
  return { body: result };
}

module.exports.handler = withErrorHandling(handler);
