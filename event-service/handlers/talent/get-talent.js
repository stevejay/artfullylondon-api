'use strict';

const cacheControlGeneratorHandler = require('../../lib/lambda/cache-control-generator-handler');
const talentService = require('../../lib/talent/talent-service');

function* handler(event) {
  const id = event.pathParameters.id;
  const entity = yield talentService.getTalent(id);
  return { entity };
}

module.exports.handler = cacheControlGeneratorHandler(handler, 1800);
