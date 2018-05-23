"use strict";

const generatorHandler = require("../../lambda/generator-handler");
const talentService = require("../../talent/talent-service");

function* handler(event) {
  const id = event.pathParameters.id;
  const entity = yield talentService.getTalentForEdit(id);
  return { entity };
}

exports.handler = generatorHandler(handler);
