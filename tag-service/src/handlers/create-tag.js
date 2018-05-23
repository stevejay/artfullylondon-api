"use strict";

require("../aws-cloudwatch-retry");
const withErrorHandling = require("lambda-error-handler");
const tagService = require("../tag-service");
const withWriteAuthorization = require("../with-write-authorization");

async function handler(event) {
  const body = JSON.parse(event.body);

  const request = {
    type: event.pathParameters.type,
    label: body.label
  };

  const result = await tagService.createTag(request);
  return { body: result };
}

exports.handler = withWriteAuthorization(withErrorHandling(handler));
