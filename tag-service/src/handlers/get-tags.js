"use strict";

require("../aws-cloudwatch-retry");
const withErrorHandling = require("lambda-error-handler");
const tagService = require("../tag-service");

async function handler(event) {
  const request = { tagType: event.pathParameters.type };
  const result = await tagService.getTagsByType(request);
  return { body: result };
}

exports.handler = withErrorHandling(handler);
