"use strict";

const withErrorHandling = require("lambda-error-handler");
const userService = require("../user-service");

async function handler(event) {
  const request = {
    userId: event.requestContext.authorizer.principalId
  };

  const watches = await userService.getAllWatches(request);
  return { body: { watches } };
}

module.exports.handler = withErrorHandling(handler);
