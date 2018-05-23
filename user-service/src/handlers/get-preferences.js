"use strict";

const withErrorHandling = require("lambda-error-handler");
const userService = require("../user-service");

async function handler(event) {
  const request = {
    userId: event.requestContext.authorizer.principalId
  };

  const preferences = await userService.getPreferences(request);
  return { body: { preferences } };
}

exports.handler = withErrorHandling(handler);
