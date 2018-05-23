"use strict";

const withErrorHandling = require("lambda-error-handler");
const talentService = require("../../talent/talent-service");

async function handler(event) {
  const ids =
    event.queryStringParameters && event.queryStringParameters.ids
      ? decodeURIComponent(event.queryStringParameters.ids).split(",")
      : JSON.parse(event.body).ids;

  const entities = await talentService.getTalentMulti(ids);
  return { body: { entities } };
}

exports.handler = withErrorHandling(handler);
