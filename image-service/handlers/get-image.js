'use strict';

const generatorHandler = require('lambda-generator-handler');
const imageService = require('../lib/services/image-service');

function* handler(event) {
  const image = yield imageService.getImageData(event.pathParameters.id);
  return { image };
}

module.exports.handler = generatorHandler(handler);
