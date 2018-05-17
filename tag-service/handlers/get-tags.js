"use strict";

require("../lib/external-services/aws-cloudwatch-retry");
const generatorHandler = require("lambda-generator-handler");
const tagService = require("../lib/services/tag-service");

async function handler(event) {
  const request = { tagType: event.pathParameters.type };
  return await tagService.getTagsByType(request);
}

module.exports.handler = generatorHandler(handler);
