'use strict';

const constants = require('./constants');
const globalConstants = require('../constants');
const constraints = require('../data/constraints');

module.exports = {
  status: {
    presence: true,
    inclusion: globalConstants.ALLOWED_STATUS_TYPES
  },
  name: {
    string: true,
    presence: true,
    length: constraints.NAME_LENGTH
  },
  eventSeriesType: {
    presence: true,
    inclusion: constants.ALLOWED_EVENT_SERIES_TYPES
  },
  occurrence: {
    string: true,
    presence: true,
    length: constraints.ADDITIONAL_INFO_LENGTH
  },
  summary: {
    string: true,
    presence: true,
    length: constraints.SUMMARY_LENGTH
  },
  description: {
    string: true,
    presence: true,
    length: constraints.DESCRIPTION_LENGTH
  },
  descriptionCredit: {
    string: true,
    length: constraints.ADDITIONAL_INFO_LENGTH
  },
  links: {
    array: true,
    length: constraints.LINKS_LENGTH,
    each: constraints.EACH_LINK_CONSTRAINT
  },
  images: {
    array: true,
    length: constraints.IMAGES_LENGTH,
    each: constraints.EACH_IMAGE_CONSTRAINT
  },
  weSay: {
    string: true,
    length: constraints.WE_SAY_LENGTH
  },
  version: {
    number: true,
    presence: true,
    numericality: constraints.VERSION_NUMERICALITY
  },
  createdDate: {
    presence: true,
    format: constraints.DATE_REGEX
  },
  updatedDate: {
    presence: true,
    format: constraints.DATE_REGEX
  }
};
