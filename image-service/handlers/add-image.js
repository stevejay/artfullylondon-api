'use strict';

const generatorHandler = require('lambda-generator-handler');
const writeAuthorized = require('../lib/lambda/write-authorized-decorator');
const imageService = require('../lib/services/image-service');

function* handler(event) {
  const body = JSON.parse(event.body);

  const request = {
    type: body.type,
    id: event.pathParameters.id,
    url: body.url,
  };

  const image = yield imageService.addImageToStore(request);
  return { image };
}

exports.handler = writeAuthorized(generatorHandler(handler));
