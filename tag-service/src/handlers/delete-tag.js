"use strict";

require("../aws-cloudwatch-retry");
const withErrorHandling = require("lambda-error-handler");
const tagService = require("../tag-service");
const withWriteAuthorization = require("../with-write-authorization");

async function handler(event) {
  const request = {
    type: event.pathParameters.type,
    idPart: event.pathParameters.idPart
  };

  await tagService.deleteTag(request);
  return { body: { acknowledged: true } };
}

exports.handler = withWriteAuthorization(withErrorHandling(handler));
