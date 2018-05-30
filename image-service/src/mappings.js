'use strict';

exports.mapRequestToDbItem = function(request) {
  const now = new Date(Date.now());

  const result = {
    imageType: request.imageType,
    id: request.id,
    mimeType: request.mimeType,
    sourceUrl: request.sourceUrl,
    width: request.width,
    height: request.height,
    dominantColor: request.dominantColor,
    resizeVersion: request.resizeVersion,
    modifiedDate: now.toISOString(),
  };

  return result;
};

exports.mapDbItemToResponse = function(item) {
  const result = {
    imageType: item.imageType,
    id: item.id,
    mimeType: item.mimeType,
    sourceUrl: item.sourceUrl,
    width: item.width,
    height: item.height,
    ratio: item.height / item.width,
    dominantColor: item.dominantColor ? item.dominantColor : undefined,
    resizeVersion: item.resizeVersion || 0,
    modifiedDate: item.modifiedDate,
  };

  return result;
};
