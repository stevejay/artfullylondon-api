'use strict';

const co = require('co');
const tmp = require('tmp');
const imageReader = require('./image-reader');
const imageResizer = require('./image-resizer');
const file = require('../io/file');
const constants = require('../constants');
const mappings = require('../mappings');
const s3 = require('../external-services/s3');
const imageRepository = require('../persistence/image-repository');

exports.resizeImage = co.wrap(function*(
  resizeSizes,
  imageId,
  imageFilePath
) {
  yield resizeSizes.map(resizeSize => {
    const resizeSuffix = _createTempResizedFileExtension(resizeSize.suffix);
    const key = _createResizedImageBucketKey(imageId, resizeSize.suffix);
    const resizedFilePath = imageFilePath + resizeSuffix;

    return imageResizer
      .resize(
        imageFilePath,
        resizedFilePath,
        resizeSize.width,
        resizeSize.height
      )
      .then(() => file.readFile(resizedFilePath))
      .then(body =>
        s3.putObjectToS3({
          Bucket: process.env.SERVERLESS_RESIZED_IMAGES_BUCKET_NAME,
          Key: key,
          Body: body,
          ContentType: 'image/jpeg',
        })
      );
  });
});

exports.processImage = co.wrap(function*(type, id, imageUrl) {
  const dbItem = yield imageRepository.tryGetImage(id);

  if (dbItem) {
    throw new Error('[400] Image Already Exists');
  }

  const tmpPath = tmp.tmpNameSync();
  const extension = imageReader.getExtensionFromUrl(imageUrl);
  yield file.downloadFile(imageUrl, tmpPath);
  return yield _processImage(tmpPath, type, id, imageUrl, extension, false);
});

exports.reprocessImage = co.wrap(function*(id) {
  const dbItem = yield imageRepository.tryGetImage(id);

  if (!dbItem) {
    throw new Error('[404] Image Data Not Found');
  }

  if (dbItem.resizeVersion === constants.CURRENT_IMAGE_RESIZE_VERSION) {
    return { image: mappings.mapDbItemToResponse(dbItem) };
  }

  const tmpPath = tmp.tmpNameSync();
  const extension = imageReader.getExtensionFromUrl(dbItem.sourceUrl);
  const s3Key = _createOriginalImageBucketKey(dbItem.id, extension);

  yield s3.getObjectFromS3(
    process.env.SERVERLESS_ORIGINAL_IMAGES_BUCKET_NAME,
    s3Key,
    tmpPath
  );

  return yield _processImage(
    tmpPath,
    dbItem.imageType,
    dbItem.id,
    dbItem.sourceUrl,
    extension,
    true
  );
});

function* _processImage(
  filePath,
  imageType,
  id,
  sourceUrl,
  extension,
  reprocessing
) {
  const imageData = yield imageReader.getImageFeatures(filePath);

  imageData.imageType = imageType;
  imageData.id = id;
  imageData.sourceUrl = sourceUrl;
  imageData.resizeVersion = constants.CURRENT_IMAGE_RESIZE_VERSION;

  _validateImageSize(imageData.width, imageData.height);

  const fileContent = yield file.readFile(filePath);

  const originalImageKey = _createOriginalImageBucketKey(
    imageData.id,
    extension
  );

  yield s3.putObjectToS3({
    Bucket: process.env.SERVERLESS_ORIGINAL_IMAGES_BUCKET_NAME,
    Key: originalImageKey,
    Body: fileContent,
    ContentType: imageData.mimeType,
  });

  yield exports.resizeImage(constants.RESIZE_SIZES, id, filePath);
  const dbItemToSave = mappings.mapRequestToDbItem(imageData);
  yield imageRepository.saveImage(dbItemToSave, reprocessing);

  yield constants.RESIZE_SIZES.map(resizeSize => {
    const resizeSuffix = _createTempResizedFileExtension(resizeSize.suffix);
    return file.deleteFile(filePath + resizeSuffix);
  });

  // TODO could try removing any other temp files.

  return { image: mappings.mapDbItemToResponse(dbItemToSave) };
}

// TODO move these functions that create paths into their own file

function _createTempResizedFileExtension(resizeSizeSuffix) {
  return '.' + resizeSizeSuffix + '.jpg';
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
