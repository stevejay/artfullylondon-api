'use strict';

require('aws-sdk');
const lambda = require('aws-lambda-invoke');

exports.migrator = function*(entityType, item) {
  if (item.images && item.images.length) {
    // fix up image id
    item.images = item.images.map(image => {
      if (!image.id) {
        image = { id: image };
      }

      return image;
    });

    // fix up image ratio
    const imageIds = item.images.map(image => image.id);

    for (let i = 0; i < imageIds.length; ++i) {
      const imageId = imageIds[i];

      const payload = yield lambda.invoke('image-service-production-getImage', {
        path: { type: entityType, id: imageId }
      });

      const ratio = payload.ratio;

      if (!ratio) {
        throw new Error('Failed to find ratio in getImage result');
      }

      item.images.filter(image => image.id === imageId)[0].ratio = ratio; // jshint ignore:line
    }
  }

  return item;
};
