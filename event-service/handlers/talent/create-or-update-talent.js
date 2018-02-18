'use strict';

const generatorHandler = require('../../lib/lambda/generator-handler');
const writeAuthorized = require('../../lib/lambda/lambda-write-authorized-decorator');
const talentService = require('../../lib/talent/talent-service');

function* handler(event) {
  const request = JSON.parse(event.body);
  const pathId = event.pathParameters && event.pathParameters.id;
  const entity = yield talentService.createOrUpdateTalent(pathId, request);
  return { entity };
}

module.exports.handler = writeAuthorized(generatorHandler(handler));
