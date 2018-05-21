"use strict";

require("../lib/external-services/aws-cloudwatch-retry");
const withErrorHandling = require("lambda-error-handler");
const tagService = require("../lib/services/tag-service");
const withWriteAuthorization = require("../lib/lambda/with-write-authorization");

async function handler(event) {
  const request = {
    type: event.pathParameters.type,
    idPart: event.pathParameters.idPart
  };

  await tagService.deleteTag(request);
  return { body: { acknowledged: true } };
}

module.exports.handler = withWriteAuthorization(withErrorHandling(handler));
