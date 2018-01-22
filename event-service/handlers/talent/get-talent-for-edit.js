'use strict';

const generatorHandler = require('../../lib/lambda/generator-handler');
const talentService = require('../../lib/services/talent-service');

function* handler(event) {
  const id = event.pathParameters.id;
  const entity = yield talentService.getTalentForEdit(id);
  return { entity };
}

module.exports.handler = generatorHandler(handler);
