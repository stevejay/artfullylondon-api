'use strict';

require('../lib/external-services/aws-cloudwatch-retry');
const generatorHandler = require('lambda-generator-handler');
const tagService = require('../lib/services/tag-service');
const writeAuthorized = require('../lib/lambda/lambda-write-authorized-decorator');

function* handler(event) {
  const body = JSON.parse(event.body);

  const request = {
    type: event.pathParameters.type,
    label: body.label,
  };

  return yield tagService.createTag(request);
}

module.exports.handler = writeAuthorized(generatorHandler(handler));
