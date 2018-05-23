"use strict";

const withErrorHandling = require("lambda-error-handler");
const userService = require("../user-service");

async function handler(event) {
  const request = {
    userId: event.requestContext.authorizer.principalId
  };

  await userService.deleteUser(request);
  return { body: { acknowledged: true } };
}

exports.handler = withErrorHandling(handler);
