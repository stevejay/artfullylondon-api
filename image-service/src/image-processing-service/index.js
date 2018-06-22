import * as tmp from "tmp";
import * as imageReader from "./image-reader";
import * as imageResizingPipeline from "./image-resizing-pipeline";
import * as fsWrapper from "../library-wrappers/fs-wrapper";
import * as fileDownloader from "./file-downloader";
import * as filePersistence from "../file-persistence";
import * as constants from "../constants";
import * as validator from "./validator";

export const RESIZE_SIZES = [
  { width: 120, height: 120, suffix: "120x120" },
  { width: 500, height: 500, suffix: "500x500" },
  { width: 500, height: 350, suffix: "500x350" },
  { width: 750, suffix: "750x" }
];

export async function processImage(params) {
  const tempFilePath = tmp.tmpNameSync();
  await fileDownloader.downloadToDisk(params.url, tempFilePath);
  return await processImageImpl(
    tempFilePath,
    params.type,
    params.id,
    params.url
  );
}

export async function reprocessImage(params) {
  const tempFilePath = tmp.tmpNameSync();
  await filePersistence.downloadOriginalImage(
    params.id,
    params.sourceUrl,
    tempFilePath
  );
  return await processImageImpl(
    tempFilePath,
    params.imageType,
    params.id,
    params.sourceUrl
  );
}

async function processImageImpl(filePath, imageType, id, sourceUrl) {
  const imageMetadata = await imageReader.getImageMetadata(filePath);
  validator.validateImageMetadata(imageMetadata);
  const imageData = {
    ...imageMetadata,
    imageType,
    id,
    sourceUrl,
    resizeVersion: constants.CURRENT_IMAGE_RESIZE_VERSION
  };
  const fileContent = await fsWrapper.readFile(filePath);
  await filePersistence.uploadOriginalImage(
    imageData.id,
    imageData.sourceUrl,
    imageData.mimeType,
    fileContent
  );
  await Promise.all(
    RESIZE_SIZES.map(resizeSize =>
      imageResizingPipeline.run(resizeSize, id, filePath)
    )
  );
  return imageData;
}
