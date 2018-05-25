"use strict";

const withErrorHandling = require("lambda-error-handler");
const withCacheControl = require("../../lambda/with-cache-control");
const talentService = require("../../talent/talent-service");

async function handler(event) {
  const id = event.pathParameters.id;
  const entity = await talentService.getTalent(id);
  return { entity };
}

exports.handler = withErrorHandling(withCacheControl(handler, 1800));
