'use strict';

const normalisers = require('../data/normalisers');

module.exports = {
  firstNames: {
    trim: true,
    undefinedIfEmpty: true,
  },
  lastName: {
    trim: true,
  },
  commonRole: {
    trim: true,
  },
  description: {
    trim: true,
    undefinedIfEmpty: true,
  },
  descriptionCredit: {
    trim: true,
    undefinedIfEmpty: true,
  },
  links: normalisers.linksNormaliser,
  images: normalisers.imagesNormaliser,
  weSay: {
    trim: true,
    undefinedIfEmpty: true,
  },
};
