"use strict";

require("../lib/external-services/aws-cloudwatch-retry");
const tagService = require("../lib/services/tag-service");
const writeAuthorized = require("../lib/lambda/lambda-write-authorized-decorator");

async function handler(event) {
  const body = JSON.parse(event.body);

  const request = {
    type: event.pathParameters.type,
    label: body.label
  };

  return await tagService.createTag(request);
}

module.exports.handler = writeAuthorized(handler);
