"use strict";

const withErrorHandling = require("lambda-error-handler");
const userService = require("../user-service");

async function handler(event) {
  const request = {
    userId: event.requestContext.authorizer.principalId,
    preferences: JSON.parse(event.body)
  };

  await userService.updatePreferences(request);
  return { body: { acknowledged: true } };
}

module.exports.handler = withErrorHandling(handler);
