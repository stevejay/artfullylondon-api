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
  return { image: mapper.mapImageToResponse(dbImage) };
}

export async function getImageData(params) {
  const dbImage = await imageRepository.getImage(params.id);
  return { image: mapper.mapImageToResponse(dbImage) };
}

export async function startReprocessingImages() {
  const iterationId = await iterationLogRepository.createLog(
    ITERATE_IMAGES_ACTION_ID
  );
  await notifier.startReprocessingImages(iterationId);
  return { acknowledged: true };
}

// TODO improve error handling here:
export async function reprocessNextImage(message) {
  const startTime = process.hrtime();
  const nextImage = await imageRepository.getNextImage(message.lastId);
  if (nextImage) {
    try {
      let dbImage = await imageRepository.getImage(nextImage.id);
      if (dbImage.resizeVersion !== constants.CURRENT_IMAGE_RESIZE_VERSION) {
        const image = await imageProcessingService.reprocessImage(dbImage);
        dbImage = mapper.mapImageDataToDb(image);
        await imageRepository.updateImage(dbImage);
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
