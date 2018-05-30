"use strict";

const im = require("imagemagick");

exports.resize = function(srcPath, destPath, newWidth, newHeight) {
  return new Promise((resolve, reject) => {
    try {
      const QUALITY = 0.82;
      const PROGRESSIVE = false;
      const FILTER = "Triangle"; // FYI an alternative is Lagrange
      const FORMAT = "jpg";

      const callback = (err /*, stdout , _stderr */) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      };

      if (newWidth && newHeight) {
        im.crop(
          {
            srcPath: srcPath,
            dstPath: destPath,
            width: newWidth,
            height: newHeight,
            format: FORMAT,
            gravity: "Center",
            filter: FILTER,
            quality: QUALITY,
            progressive: PROGRESSIVE
          },
          callback
        );
      } else {
        const resizeOptions = {
          srcPath: srcPath,
          dstPath: destPath,
          format: FORMAT,
          filter: FILTER,
          quality: QUALITY,
          progressive: PROGRESSIVE
        };

        if (newWidth) {
          resizeOptions.width = newWidth;
        }

        if (newHeight) {
          resizeOptions.height = newHeight;
        }

        im.resize(resizeOptions, callback);
      }
    } catch (err) {
      reject(err);
    }
  });
};
