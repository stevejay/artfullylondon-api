import * as imageRepository from "../persistence/image-repository";
import * as iterationLogRepository from "../persistence/iteration-log-repository";
import * as imageProcessingService from "../image-processing-service";
import * as mapper from "./mapper";
import * as normaliser from "./normaliser";
import * as validator from "./validator";
import * as constants from "../constants";
import * as notifier from "../notifier";
import iterationThrottler from "./iteration-throttler";

const ITERATE_IMAGES_ACTION_ID = "IterateImages";

export async function addImage(request) {
  const image = normaliser.normaliseAddImageRequest(request);
  validator.validateAddImageRequest(image);
  imageRepository.validateDoesNotExist(image.id);
  const imageData = await imageProcessingService.processImage(image);
  const dbImage = mapper.mapImageDataToDb(imageData);
  await imageRepository.createImage(dbImage);
  return { node: mapper.mapImageToResponse(dbImage) };
}

export async function getImageData(params) {
  const dbImage = await imageRepository.getImage(params.id);
  return { node: dbImage ? mapper.mapImageToResponse(dbImage) : null };
}

export async function startReprocessingImages() {
  const iterationId = await iterationLogRepository.createLog(
    ITERATE_IMAGES_ACTION_ID
  );
  await notifier.startReprocessingImages(iterationId);
  return { iteration: { actionId: ITERATE_IMAGES_ACTION_ID, iterationId } };
}

// TODO improve error handling here:
export async function reprocessNextImage(message) {
  const startTime = process.hrtime();
  const nextImage = await imageRepository.getNextImage(message.lastId);
  if (nextImage) {
    try {
      const dbImage = await imageRepository.getImage(nextImage.id);
      if (!dbImage) {
        throw new Error("Not Found");
      }
      if (dbImage.resizeVersion !== constants.CURRENT_IMAGE_RESIZE_VERSION) {
        const updatedImage = await imageProcessingService.reprocessImage(
          dbImage
        );
        const updatedDbImage = mapper.mapImageDataToDb(updatedImage);
        await imageRepository.updateImage(updatedDbImage);
      }
    } catch (err) {
      await iterationLogRepository.addErrorToLog(
        ITERATE_IMAGES_ACTION_ID,
        message.iterationId,
        `Error with image ${nextImage.id}: ${err.message}`
      );
    }
    await iterationThrottler(startTime, 500);
    await notifier.reprocessNextImage(message.iterationId, nextImage.id);
  } else {
    await iterationLogRepository.closeLog(
      ITERATE_IMAGES_ACTION_ID,
      message.iterationId
    );
  }
}
