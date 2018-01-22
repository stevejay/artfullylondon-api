'use strict';

const normalisers = require('../data/normalisers');

module.exports = {
  name: {
    trim: true,
  },
  summary: {
    trim: true,
  },
  description: {
    trim: true,
  },
  descriptionCredit: {
    trim: true,
    undefinedIfEmpty: true,
  },
  occurrence: {
    trim: true,
  },
  links: normalisers.linksNormaliser,
  images: normalisers.imagesNormaliser,
  weSay: {
    trim: true,
    undefinedIfEmpty: true,
  },
};
