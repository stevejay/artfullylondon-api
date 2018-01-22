'use strict';

require('../lib/external-services/aws-cloudwatch-retry');
const generatorHandler = require('lambda-generator-handler');
const tagService = require('../lib/services/tag-service');
const writeAuthorized = require('../lib/lambda/lambda-write-authorized-decorator');

function* handler(event) {
  const request = {
    type: event.pathParameters.type,
    idPart: event.pathParameters.idPart,
  };

  yield tagService.deleteTag(request);
  return { acknowledged: true };
}

module.exports.handler = writeAuthorized(generatorHandler(handler));
