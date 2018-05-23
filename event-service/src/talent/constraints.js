'use strict';

const isNil = require('lodash.isnil');
const constants = require('./constants');
const globalConstants = require('../constants');
const constraints = require('../data/constraints');

module.exports = {
  status: {
    presence: true,
    inclusion: globalConstants.ALLOWED_STATUS_TYPES
  },
  talentType: {
    presence: true,
    inclusion: constants.ALLOWED_TALENT_TYPES,
    dependency: {
      test: value => value === constants.TALENT_TYPE_GROUP,
      ensure: (_, attrs) => isNil(attrs.firstNames),
      message: 'first names should be blank for group talent'
    }
  },
  firstNames: {
    string: true,
    length: constraints.NAME_LENGTH
  },
  lastName: {
    string: true,
    presence: true,
    length: constraints.NAME_LENGTH
  },
  commonRole: {
    string: true,
    presence: true,
    length: constraints.ADDITIONAL_INFO_LENGTH
  },
  description: {
    string: true,
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
