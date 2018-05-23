'use strict';

const constants = require('./constants');
const globalConstants = require('../constants');
const globalConstraints = require('../data/constraints');

module.exports = {
  status: {
    presence: true,
    inclusion: globalConstants.ALLOWED_STATUS_TYPES
  },
  name: {
    string: true,
    presence: true,
    length: globalConstraints.NAME_LENGTH
  },
  venueType: {
    string: true,
    presence: true,
    inclusion: constants.ALLOWED_VENUE_TYPES
  },
  description: {
    string: true,
    length: globalConstraints.DESCRIPTION_LENGTH
  },
  descriptionCredit: {
    string: true,
    length: globalConstraints.ADDITIONAL_INFO_LENGTH
  },
  address: {
    string: true,
    presence: true,
    length: globalConstraints.ADDRESS_LENGTH
  },
  postcode: {
    string: true,
    presence: true,
    format: globalConstraints.POSTCODE_REGEX
  },
  latitude: {
    number: true,
    presence: true,
    numericality: globalConstraints.LONDON_LATITUDE_NUMERICALITY
  },
  longitude: {
    number: true,
    presence: true,
    numericality: globalConstraints.LONDON_LONGITUDE_NUMERICALITY
  },
  wheelchairAccessType: {
    string: true,
    presence: true,
    inclusion: globalConstants.ALLOWED_WHEELCHAIR_ACCESS_TYPES
  },
  disabledBathroomType: {
    string: true,
    presence: true,
    inclusion: globalConstants.ALLOWED_DISABLED_BATHROOM_TYPES
  },
  hearingFacilitiesType: {
    string: true,
    presence: true,
    inclusion: globalConstants.ALLOWED_HEARING_FACILITIES_TYPES
  },
  email: {
    email: true,
    length: globalConstraints.EMAIL_LENGTH
  },
  telephone: {
    string: true,
    format: globalConstraints.TELEPHONE_REGEX
  },
  openingTimes: {
    array: true,
    length: globalConstraints.TIMES_ARRAY_LENGTH,
    ordered: globalConstraints.OPENING_TIMES_ORDER,
    each: globalConstraints.EACH_DAY_RANGE_CONSTRAINT
  },
  additionalOpeningTimes: {
    array: true,
    length: globalConstraints.TIMES_ARRAY_LENGTH,
    ordered: globalConstraints.OPENING_TIMES_WITH_DATE_RANGE_ORDER,
    each: globalConstraints.EACH_DATE_RANGE_CONSTRAINT
  },
  openingTimesClosures: {
    array: true,
    length: globalConstraints.TIMES_ARRAY_LENGTH,
    ordered: globalConstraints.OPENING_TIMES_CLOSURES_ORDER,
    each: globalConstraints.EACH_DATE_OPTIONAL_RANGE_CONSTRAINT
  },
  namedClosures: {
    array: true,
    length: {
      maximum: globalConstants.ALLOWED_NAMED_CLOSURE_TYPES.length
    },
    each: {
      string: true,
      inclusion: globalConstants.ALLOWED_NAMED_CLOSURE_TYPES
    }
  },
  links: {
    array: true,
    length: globalConstraints.LINKS_LENGTH,
    each: globalConstraints.EACH_LINK_CONSTRAINT
  },
  images: {
    array: true,
    length: globalConstraints.IMAGES_LENGTH,
    each: globalConstraints.EACH_IMAGE_CONSTRAINT
  },
  weSay: {
    string: true,
    length: globalConstraints.WE_SAY_LENGTH
  },
  notes: {
    string: true,
    length: globalConstraints.NOTES_LENGTH
  },
  version: {
    number: true,
    presence: true,
    numericality: globalConstraints.VERSION_NUMERICALITY
  },
  createdDate: {
    presence: true,
    format: globalConstraints.DATE_REGEX
  },
  updatedDate: {
    presence: true,
    format: globalConstraints.DATE_REGEX
  },
  hasPermanentCollection: {
    presence: true,
    bool: true
  }
};
