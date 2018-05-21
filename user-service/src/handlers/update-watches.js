"use strict";

const withErrorHandling = require("lambda-error-handler");
const userService = require("../user-service");

async function handler(event) {
  const body = JSON.parse(event.body);

  const request = {
    userId: event.requestContext.authorizer.principalId,
    entityType: event.pathParameters.entityType,
    newVersion: body.newVersion,
    changes: body.changes
  };

  await userService.updateWatches(request);
  return { body: { acknowledged: true } };
}

module.exports.handler = withErrorHandling(handler);
