"use strict";

const im = require("imagemagick");
const dominantColor = require("dominant-color");

const FILE_EXTENSION_REGEX = /\.[^./]+$/i;
const QUERY_STRING_REGEX = /\?[^?]*$/i;

exports.getImageFeatures = async function(imagePath) {
  const features = await new Promise((resolve, reject) => {
    im.identify(imagePath, (err, features) => {
      if (err) {
        reject(err);
      } else {
        resolve(features);
      }
    });
  });

  await new Promise((resolve, reject) =>
    dominantColor(imagePath, (err, color) => {
      if (err) {
        reject(err);
      } else {
        features.dominantColor = color; // e.g., '5b6c6e'
        resolve(features);
      }
    })
  );

  const mimeType = _getMimeTypeFromFormat(features.format);

  return {
    mimeType,
    width: features.width,
    height: features.height,
    dominantColor: features.dominantColor
  };
};

exports.getExtensionFromUrl = function(url) {
  const replacedUrl = (url || "").replace(QUERY_STRING_REGEX, "");

  const match = replacedUrl.match(FILE_EXTENSION_REGEX);
  if (!match) {
    return ".jpg";
  }

  return match[0].toLowerCase();
};

function _getMimeTypeFromFormat(format) {
  switch (format) {
    case "PNG":
      return "image/png";
    case "JPEG":
      return "image/jpeg";
    case "WEBP":
      return "image/webp";
    default:
      throw new Error(`Unknown file format: ${format}`);
  }
}
