"use strict";

require("../lib/external-services/aws-cloudwatch-retry");
const tagService = require("../lib/services/tag-service");
const withErrorHandling = require("../lib/lambda/with-error-handling");

async function handler(event) {
  const request = { tagType: event.pathParameters.type };
  const result = await tagService.getTagsByType(request);
  return { body: result };
}

module.exports.handler = withErrorHandling(handler);
