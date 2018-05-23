"use strict";

const generatorHandler = require("../../lambda/generator-handler");
const talentService = require("../../talent/talent-service");

function* handler(event) {
  const ids =
    event.queryStringParameters && event.queryStringParameters.ids
      ? decodeURIComponent(event.queryStringParameters.ids).split(",")
      : JSON.parse(event.body).ids;

  const entities = yield talentService.getTalentMulti(ids);
  return { entities };
}

exports.handler = generatorHandler(handler);
