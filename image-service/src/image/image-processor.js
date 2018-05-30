"use strict";

const tmp = require("tmp");
const imageReader = require("./image-reader");
const imageResizer = require("./image-resizer");
const file = require("../io/file");
const constants = require("../constants");
const mappings = require("../mappings");
const s3 = require("../external-services/s3");
const imageRepository = require("../persistence/image-repository");

exports.resizeImage = async function(resizeSizes, imageId, imageFilePath) {
  await Promise.all(
    resizeSizes.map(async resizeSize => {
      const resizeSuffix = _createTempResizedFileExtension(resizeSize.suffix);
      const key = _createResizedImageBucketKey(imageId, resizeSize.suffix);
      const resizedFilePath = imageFilePath + resizeSuffix;

      await imageResizer.resize(
        imageFilePath,
        resizedFilePath,
        resizeSize.width,
        resizeSize.height
      );

      const body = await file.readFile(resizedFilePath);

      await s3.putObjectToS3({
        Bucket: process.env.SERVERLESS_RESIZED_IMAGES_BUCKET_NAME,
        Key: key,
        Body: body,
        ContentType: "image/jpeg"
      });
    })
  );
};

exports.processImage = async function(type, id, imageUrl) {
  const dbItem = await imageRepository.tryGetImage(id);

  if (dbItem) {
    throw new Error("[400] Image Already Exists");
  }

  const tmpPath = tmp.tmpNameSync();
  const extension = imageReader.getExtensionFromUrl(imageUrl);
  await file.downloadFile(imageUrl, tmpPath);
  return await _processImage(tmpPath, type, id, imageUrl, extension, false);
};

exports.reprocessImage = async function(id) {
  const dbItem = await imageRepository.tryGetImage(id);

  if (!dbItem) {
    throw new Error("[404] Image Data Not Found");
  }

  if (dbItem.resizeVersion === constants.CURRENT_IMAGE_RESIZE_VERSION) {
    return { image: mappings.mapDbItemToResponse(dbItem) };
  }

  const tmpPath = tmp.tmpNameSync();
  const extension = imageReader.getExtensionFromUrl(dbItem.sourceUrl);
  const s3Key = _createOriginalImageBucketKey(dbItem.id, extension);

  await s3.getObjectFromS3(
    process.env.SERVERLESS_ORIGINAL_IMAGES_BUCKET_NAME,
    s3Key,
    tmpPath
  );

  return await _processImage(
    tmpPath,
    dbItem.imageType,
    dbItem.id,
    dbItem.sourceUrl,
    extension,
    true
  );
};

async function _processImage(
  filePath,
  imageType,
  id,
  sourceUrl,
  extension,
  reprocessing
) {
  const imageData = await imageReader.getImageFeatures(filePath);

  imageData.imageType = imageType;
  imageData.id = id;
  imageData.sourceUrl = sourceUrl;
  imageData.resizeVersion = constants.CURRENT_IMAGE_RESIZE_VERSION;

  _validateImageSize(imageData.width, imageData.height);

  const fileContent = await file.readFile(filePath);

  const originalImageKey = _createOriginalImageBucketKey(
    imageData.id,
    extension
  );

  await s3.putObjectToS3({
    Bucket: process.env.SERVERLESS_ORIGINAL_IMAGES_BUCKET_NAME,
    Key: originalImageKey,
    Body: fileContent,
    ContentType: imageData.mimeType
  });

  await exports.resizeImage(constants.RESIZE_SIZES, id, filePath);
  const dbItemToSave = mappings.mapRequestToDbItem(imageData);
  await imageRepository.saveImage(dbItemToSave, reprocessing);

  await constants.RESIZE_SIZES.map(resizeSize => {
    const resizeSuffix = _createTempResizedFileExtension(resizeSize.suffix);
    return file.deleteFile(filePath + resizeSuffix);
  });

  // TODO could try removing any other temp files.

  return { image: mappings.mapDbItemToResponse(dbItemToSave) };
}

// TODO move these functions that create paths into their own file

function _createTempResizedFileExtension(resizeSizeSuffix) {
  return "." + resizeSizeSuffix + ".jpg";
}

function _createOriginalImageBucketKey(id, extension) {
  return `${id.substring(0, 2)}/${id.substring(2, 4)}/${id}${extension}`;
}

function _createResizedImageBucketKey(id, resizedSize) {
  return `${id.substring(0, 2)}/${id.substring(2, 4)}/${id}/${resizedSize}.jpg`;
}

function _validateImageSize(width, height) {
  if (
    width < constants.MIN_IMAGE_WIDTH &&
    height < constants.MIN_IMAGE_HEIGHT
  ) {
    throw new Error(`[400] Image is too small (${width}x${height})`);
  }

  if (
    width > constants.MAX_IMAGE_WIDTH &&
    height > constants.MAX_IMAGE_HEIGHT
  ) {
    throw new Error(`[400] Image is too large (${width}x${height})`);
  }
}
