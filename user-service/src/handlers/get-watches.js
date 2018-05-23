"use strict";

const withErrorHandling = require("lambda-error-handler");
const userService = require("../user-service");

async function handler(event) {
  const request = {
    entityType: event.pathParameters.entityType,
    userId: event.requestContext.authorizer.principalId
  };

  const result = await userService.getWatches(request);
  return { body: result };
}

exports.handler = withErrorHandling(handler);
