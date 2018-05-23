"use strict";

const cacheControlGeneratorHandler = require("../../lambda/cache-control-generator-handler");
const talentService = require("../../talent/talent-service");

function* handler(event) {
  const id = event.pathParameters.id;
  const entity = yield talentService.getTalent(id);
  return { entity };
}

exports.handler = cacheControlGeneratorHandler(handler, 1800);
