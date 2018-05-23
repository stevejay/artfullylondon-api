"use strict";

const withErrorHandling = require("lambda-error-handler");
const talentService = require("../../talent/talent-service");

async function handler(event) {
  const id = event.pathParameters.id;
  const entity = await talentService.getTalentForEdit(id);
  return { body: { entity } };
}

exports.handler = withErrorHandling(handler);
