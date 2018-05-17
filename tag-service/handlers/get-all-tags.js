"use strict";

require("../lib/external-services/aws-cloudwatch-retry");
const generatorHandler = require("lambda-generator-handler");
const tagService = require("../lib/services/tag-service");

async function handler() {
  return await tagService.getAllTags();
}

module.exports.handler = generatorHandler(handler);
