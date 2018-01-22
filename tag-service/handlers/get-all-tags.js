'use strict';

require('../lib/external-services/aws-cloudwatch-retry');
const generatorHandler = require('lambda-generator-handler');
const tagService = require('../lib/services/tag-service');

function* handler() {
  return yield tagService.getAllTags();
}

module.exports.handler = generatorHandler(handler);
