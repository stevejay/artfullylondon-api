'use strict';

exports.imagesNormaliser = {
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

exports.linksNormaliser = {
  undefinedIfEmpty: true,
  each: {
    object: {
      url: {
        trim: true
      }
    }
  }
};
