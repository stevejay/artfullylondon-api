'use strict';

const normalisers = require('../data/normalisers');

module.exports = {
  name: {
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
  address: {
    trim: true,
    address: true,
  },
  postcode: {
    toUpperCase: true,
    collapseWhitespace: true,
    trim: true,
  },
  email: {
    trim: true,
    undefinedIfEmpty: true,
  },
  telephone: {
    replace: { pattern: /[-()]/g, newSubStr: ' ' },
    collapseWhitespace: true,
    trim: true,
    undefinedIfEmpty: true,
  },
  openingTimes: {
    undefinedIfEmpty: true,
  },
  additionalOpeningTimes: {
    undefinedIfEmpty: true,
  },
  openingTimesClosures: {
    undefinedIfEmpty: true,
  },
  namedClosures: {
    undefinedIfEmpty: true,
  },
  links: normalisers.linksNormaliser,
  images: normalisers.imagesNormaliser,
  weSay: {
    trim: true,
    undefinedIfEmpty: true,
  },
  notes: {
    trim: true,
    undefinedIfEmpty: true,
  },
};
