'use strict';

const co = require('co');
const ensure = require('ensure-request').ensure;
const normalise = require('normalise-request');
const imageRepository = require('../persistence/image-repository');
const ensureErrorHandler = require('../data/ensure-error-handler');
const constraints = require('../constraints');
const normaliser = require('../normaliser');
const constants = require('../constants');
const imageProcessor = require('../image/image-processor');
const mappings = require('../mappings');
const entityIterationService = require('./entity-iteration-service');

module.exports.addImageToStore = co.wrap(function*(request) {
  normalise(request, normaliser);
  ensure(request, constraints.image, ensureErrorHandler);

  return yield imageProcessor.processImage(
    request.type,
    request.id,
    request.url
  );
});

module.exports.getImageData = co.wrap(function*(imageId) {
  const image = yield imageRepository.getImage(imageId);
  return mappings.mapDbItemToResponse(image);
});

module.exports.startReprocessingImages = () =>
  entityIterationService.startIteration(
    constants.ITERATE_IMAGES_ACTION_ID,
    process.env.SERVERLESS_REPROCESS_IMAGES_TOPIC_ARN
  );

module.exports.reprocessNextImage = co.wrap(function*(
  lastId,
  startTimestamp
) {
  const startTime = process.hrtime();
  const image = yield imageRepository.getNextImage(lastId);

  if (image) {
    try {
      yield imageProcessor.reprocessImage(image.id);
    } catch (err) {
      yield entityIterationService.addIterationError(
        err.message,
        constants.ITERATE_IMAGES_ACTION_ID,
        startTimestamp,
        image.id
      );
    }

    yield entityIterationService.throttleIteration(startTime, 250);
  }

  // TODO alternatively, if there's been an error, I could retry.

  yield entityIterationService.invokeNextIteration(
    image ? image.id : null,
    startTimestamp,
    constants.ITERATE_IMAGES_ACTION_ID,
    process.env.SERVERLESS_REPROCESS_IMAGES_TOPIC_ARN
  );
});
