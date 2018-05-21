"use strict";

require("../lib/external-services/aws-cloudwatch-retry");
const withErrorHandling = require("lambda-error-handler");
const tagService = require("../lib/services/tag-service");

async function handler(event) {
  const request = { tagType: event.pathParameters.type };
  const result = await tagService.getTagsByType(request);
  return { body: result };
}

module.exports.handler = withErrorHandling(handler);
