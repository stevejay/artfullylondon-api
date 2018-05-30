"use strict";

const ensure = require("ensure-request").ensure;
const normalise = require("normalise-request");
const imageRepository = require("../persistence/image-repository");
const ensureErrorHandler = require("../data/ensure-error-handler");
const constraints = require("../constraints");
const normaliser = require("../normaliser");
const constants = require("../constants");
const imageProcessor = require("../image/image-processor");
const mappings = require("../mappings");
const entityIterationService = require("./entity-iteration-service");

exports.addImageToStore = async function(request) {
  normalise(request, normaliser);
  ensure(request, constraints.image, ensureErrorHandler);

  return await imageProcessor.processImage(
    request.type,
    request.id,
    request.url
  );
};

exports.getImageData = async function(imageId) {
  const image = await imageRepository.getImage(imageId);
  return mappings.mapDbItemToResponse(image);
};

exports.startReprocessingImages = () =>
  entityIterationService.startIteration(
    constants.ITERATE_IMAGES_ACTION_ID,
    process.env.SERVERLESS_REPROCESS_IMAGES_TOPIC_ARN
  );

exports.reprocessNextImage = async function(lastId, startTimestamp) {
  const startTime = process.hrtime();
  const image = await imageRepository.getNextImage(lastId);

  if (image) {
    try {
      await imageProcessor.reprocessImage(image.id);
    } catch (err) {
      await entityIterationService.addIterationError(
        err.message,
        constants.ITERATE_IMAGES_ACTION_ID,
        startTimestamp,
        image.id
      );
    }

    await entityIterationService.throttleIteration(startTime, 250);
  }

  // TODO alternatively, if there's been an error, I could retry.

  await entityIterationService.invokeNextIteration(
    image ? image.id : null,
    startTimestamp,
    constants.ITERATE_IMAGES_ACTION_ID,
    process.env.SERVERLESS_REPROCESS_IMAGES_TOPIC_ARN
  );
};
