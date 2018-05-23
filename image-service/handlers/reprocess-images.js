'use strict';

const generatorHandler = require('lambda-generator-handler');
const writeAuthorized = require('../lib/lambda/write-authorized-decorator');
const imageService = require('../lib/services/image-service');

function* handler() {
  yield imageService.startReprocessingImages();
  return { acknowledged: true };
}

exports.handler = writeAuthorized(generatorHandler(handler));
