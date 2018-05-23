"use strict";

const generatorHandler = require("../../lambda/generator-handler");
const writeAuthorized = require("../../lambda/lambda-write-authorized-decorator");
const talentService = require("../../talent/talent-service");

function* handler(event) {
  const request = JSON.parse(event.body);
  const pathId = event.pathParameters && event.pathParameters.id;
  const entity = yield talentService.createOrUpdateTalent(pathId, request);
  return { entity };
}

exports.handler = writeAuthorized(generatorHandler(handler));
