'use strict';

module.exports.imagesNormaliser = {
  undefinedIfEmpty: true,
  each: {
    object: {
      copyright: {
        trim: true,
        undefinedIfEmpty: true
      },
      dominantColor: {
        trim: true,
        undefinedIfEmpty: true
      }
    }
  }
};

module.exports.linksNormaliser = {
  undefinedIfEmpty: true,
  each: {
    object: {
      url: {
        trim: true
      }
    }
  }
};
