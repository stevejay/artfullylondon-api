"use strict";

require("../lib/external-services/aws-cloudwatch-retry");
const tagService = require("../lib/services/tag-service");
const withWriteAuthorization = require("../lib/lambda/with-write-authorization");
const withErrorHandling = require("../lib/lambda/with-error-handling");

async function handler(event) {
  const request = {
    type: event.pathParameters.type,
    idPart: event.pathParameters.idPart
  };

  await tagService.deleteTag(request);
  return { body: { acknowledged: true } };
}

module.exports.handler = withWriteAuthorization(withErrorHandling(handler));
