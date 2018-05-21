"use strict";

require("../lib/external-services/aws-cloudwatch-retry");
const tagService = require("../lib/services/tag-service");
const withErrorHandling = require("../lib/lambda/with-error-handling");

async function handler() {
  const result = await tagService.getAllTags();
  return { body: result };
}

module.exports.handler = withErrorHandling(handler);
