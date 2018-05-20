"use strict";

const ERROR_CODE_REGEX = /^\[(\d\d\d)\]/;

require("../lib/external-services/aws-cloudwatch-retry");
const tagService = require("../lib/services/tag-service");
const writeAuthorized = require("../lib/lambda/lambda-write-authorized-decorator");

function errorHandler(handler) {
  return async function(event, context) {
    try {
      await handler(event, context);
    } catch (err) {
      let statusCode = null;

      if (err.code === "ConditionalCheckFailedException") {
        err.message = "[400] Stale Data";
        statusCode = 400;
      } else {
        const errorCodeMatch = (err.message || "").match(ERROR_CODE_REGEX);

        if (!errorCodeMatch) {
          err.message = "[500] " + (err.message || "Unknown error");
          statusCode = 500;
        } else {
          statusCode = parseInt(errorCodeMatch[1]);
        }
      }

      const body = JSON.stringify({ error: err.message });

      const result = {
        statusCode,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true
        },
        body
      };

      return result;
    }
  };
}
async function handler(event) {
  const body = JSON.parse(event.body);

  const request = {
    type: event.pathParameters.type,
    label: body.label
  };

  const result = await tagService.createTag(request);
  return { body: result };
}

module.exports.handler = writeAuthorized(handler);
