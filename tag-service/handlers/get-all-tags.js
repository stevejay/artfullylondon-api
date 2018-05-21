"use strict";

require("../lib/external-services/aws-cloudwatch-retry");
const withErrorHandling = require("lambda-error-handler");
const tagService = require("../lib/services/tag-service");

async function handler() {
  const result = await tagService.getAllTags();
  return { body: result };
}

module.exports.handler = withErrorHandling(handler);
