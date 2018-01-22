'use strict';

const generatorHandler = require('../../lib/lambda/generator-handler');
const talentService = require('../../lib/services/talent-service');

function* handler(event) {
  const ids = event.queryStringParameters && event.queryStringParameters.ids
    ? decodeURIComponent(event.queryStringParameters.ids).split(',')
    : JSON.parse(event.body).ids;

  const entities = yield talentService.getTalentMulti(ids);
  return { entities };
}

module.exports.handler = generatorHandler(handler);
