"use strict";

require("../lib/external-services/aws-cloudwatch-retry");
const tagService = require("../lib/services/tag-service");
const withWriteAuthorization = require("../lib/lambda/with-write-authorization");
const withErrorHandling = require("../lib/lambda/with-error-handling");

async function handler(event) {
  const body = JSON.parse(event.body);

  const request = {
    type: event.pathParameters.type,
    label: body.label
  };

  const result = await tagService.createTag(request);
  return { body: result };
}

module.exports.handler = withWriteAuthorization(withErrorHandling(handler));
