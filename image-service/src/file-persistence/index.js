import * as s3Client from "./s3-client";

export async function uploadOriginalImage(id, sourceUrl, mimeType, content) {
  const key = createOriginalImageBucketKey(id, sourceUrl);
  await s3Client.putObjectToS3(
    process.env.SERVERLESS_ORIGINAL_IMAGES_BUCKET_NAME,
    key,
    mimeType,
    content
  );
}

export async function uploadResizedJpegImage(id, resizedSize, content) {
  const key = createResizedImageBucketKey(id, resizedSize);
  await s3Client.putObjectToS3(
    process.env.SERVERLESS_RESIZED_IMAGES_BUCKET_NAME,
    key,
    "image/jpeg",
    content
  );
}

export async function downloadOriginalImage(id, sourceUrl, destFilePath) {
  const key = createOriginalImageBucketKey(id, sourceUrl);
  await s3Client.getObjectFromS3(
    process.env.SERVERLESS_ORIGINAL_IMAGES_BUCKET_NAME,
    key,
    destFilePath
  );
}

export async function downloadResizedJpegImage(id, resizedSize, destFilePath) {
  const key = createResizedImageBucketKey(id, resizedSize);
  await s3Client.getObjectFromS3(
    process.env.SERVERLESS_RESIZED_IMAGES_BUCKET_NAME,
    key,
    destFilePath
  );
}

const FILE_EXTENSION_REGEX = /\.[^./]+$/i;
const QUERY_STRING_REGEX = /\?[^?]*$/i;

function getExtensionFromUrl(url) {
  const replacedUrl = (url || "").replace(QUERY_STRING_REGEX, "");
  const match = replacedUrl.match(FILE_EXTENSION_REGEX);
  return match ? match[0].toLowerCase() : ".jpg";
}

function createOriginalImageBucketKey(id, sourceUrl) {
  const extension = getExtensionFromUrl(sourceUrl);
  return `${id.substring(0, 2)}/${id.substring(2, 4)}/${id}${extension}`;
}

function createResizedImageBucketKey(id, resizedSize) {
  return `${id.substring(0, 2)}/${id.substring(2, 4)}/${id}/${resizedSize}.jpg`;
}
