"use strict";

require("../lib/external-services/aws-cloudwatch-retry");
const tagService = require("../lib/services/tag-service");
const writeAuthorized = require("../lib/lambda/lambda-write-authorized-decorator");

async function handler(event) {
  const request = {
    type: event.pathParameters.type,
    idPart: event.pathParameters.idPart
  };

  await tagService.deleteTag(request);
  return { body: { acknowledged: true } };
}

module.exports.handler = writeAuthorized(handler);
