'use strict';

const cacheControlGeneratorHandler = require('../../lib/lambda/cache-control-generator-handler');
const talentService = require('../../lib/services/talent-service');
const entityLib = require('../../lib/entity/entity');

function* handler(event) {
  const isPublicRequest = entityLib.isPublicRequest(event);
  const id = event.pathParameters.id;
  const entity = yield talentService.getTalent(id, isPublicRequest);
  return { entity };
}

module.exports.handler = cacheControlGeneratorHandler(handler, 1800);
