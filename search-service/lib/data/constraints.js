'use strict';

const constants = require('../constants');

const DATE_REGEX = /^[12]\d\d\d\/[01]\d\/[0123]\d$/;
const TIME_REGEX = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
const MEDIUM_TAG_REGEX = /^(?:medium\/[^/\s]+|:all-visual|:all-performing|:all-creative-writing)$/;
const STYLE_TAG_REGEX = /^style\/[^/\s]+$/;
const AUDIENCE_TAG_REGEX = /^audience\/[^/\s]+$/;

const TERM_LENGTH = { minimum: 1, maximum: 100 };
const ID_LENGTH = { minimum: 1, maximum: 300 };

const LATITUDE_NUMERICALITY = {
  greaterThanOrEqualTo: -90,
  lessThanOrEqualTo: 90,
};

const LONGITUDE_NUMERICALITY = {
  greaterThanOrEqualTo: -180,
  lessThanOrEqualTo: 180,
};

const SKIP_NUMERICALITY = { onlyInteger: true, greaterThanOrEqualTo: 0 };

const LATITUDE_DEPENDENCY = {
  ensure: (value, attrs) => value < attrs.north,
  message: 'south value must be less than north value',
};

const LONGITUDE_DEPENDENCY = {
  ensure: (value, attrs) => value > attrs.west,
  message: 'east value must be greater than west value',
};

exports.autocompleteSearch = {
  term: {
    string: true,
    presence: true,
    length: exports.TERM_LENGTH,
  },
  entityType: {
    string: true,
    inclusion: constants.ALLOWED_ENTITY_TYPES,
  },
};

exports.basicSearch = {
  term: {
    string: true,
    length: exports.TERM_LENGTH,
  },
  entityType: {
    presence: true,
    string: true,
    inclusion: constants.ALLOWED_ENTITY_TYPES,
    dependency: [
      {
        test: value => !value || value === constants.ENTITY_TYPE_ALL,
        ensure: (_, attrs) => attrs.skip === 0,
        message:
          'Skip must be zero or not included when searching all entities',
      },
      {
        test: value => value !== constants.ENTITY_TYPE_VENUE,
        ensure: (_, attrs) =>
          !attrs.north && !attrs.south && !attrs.east && !attrs.west,
        message: 'location can only be included when entityType value is venue',
      },
    ],
  },
  location: {
    object: {
      north: {
        presence: true,
        numericality: exports.LATITUDE_NUMERICALITY,
      },
      west: {
        presence: true,
        numericality: exports.LONGITUDE_NUMERICALITY,
      },
      south: {
        presence: true,
        numericality: exports.LATITUDE_NUMERICALITY,
        dependency: exports.LATITUDE_DEPENDENCY,
      },
      east: {
        presence: true,
        numericality: exports.LONGITUDE_NUMERICALITY,
        dependency: exports.LONGITUDE_DEPENDENCY,
      },
    },
  },
  skip: {
    presence: true,
    number: true,
    numericality: exports.SKIP_NUMERICALITY,
  },
  take: {
    presence: true,
    number: true,
    numericality: {
      onlyInteger: true,
      greaterThanOrEqualTo: 1,
      lessThanOrEqualTo: 300,
    },
  },
};

exports.eventAdvancedSearch = {
  term: {
    string: true,
    length: TERM_LENGTH,
  },
  dateFrom: {
    string: true,
    format: DATE_REGEX,
  },
  dateTo: {
    string: true,
    format: DATE_REGEX,
    dependency: {
      ensure: (value, attrs) =>
        !value || !attrs.dateFrom || value >= attrs.dateFrom,
      message: 'dateTo must be greater than or equal to dateFrom',
    },
  },
  timeFrom: {
    string: true,
    format: TIME_REGEX,
  },
  timeTo: {
    string: true,
    format: TIME_REGEX,
    dependency: {
      ensure: (value, attrs) =>
        !value || !attrs.timeFrom || value >= attrs.timeFrom,
      message: 'timeTo must be greater than or equal to timeFrom',
    },
  },
  medium: {
    string: true,
    format: MEDIUM_TAG_REGEX,
  },
  style: {
    string: true,
    format: STYLE_TAG_REGEX,
    dependency: {
      ensure: (value, attrs) =>
        !value || (!!attrs.medium && attrs.medium.indexOf('medium/') === 0),
      message: 'Cannot have style tag and no medium tag',
    },
  },
  audience: {
    string: true,
    format: AUDIENCE_TAG_REGEX,
  },
  cost: {
    string: true,
    inclusion: constants.ALLOWED_COST_TYPES,
  },
  booking: {
    string: true,
    inclusion: constants.ALLOWED_BOOKING_TYPES,
  },
  area: {
    string: true,
    inclusion: constants.ALLOWED_AREA_TYPES,
  },
  location: {
    object: {
      north: {
        presence: true,
        numericality: LATITUDE_NUMERICALITY,
      },
      west: {
        presence: true,
        numericality: LONGITUDE_NUMERICALITY,
      },
      south: {
        presence: true,
        numericality: LATITUDE_NUMERICALITY,
        dependency: LATITUDE_DEPENDENCY,
      },
      east: {
        presence: true,
        numericality: LONGITUDE_NUMERICALITY,
        dependency: LONGITUDE_DEPENDENCY,
      },
    },
  },
  venueId: {
    string: true,
    length: ID_LENGTH,
  },
  talentId: {
    string: true,
    length: ID_LENGTH,
  },
  skip: {
    presence: true,
    number: true,
    numericality: SKIP_NUMERICALITY,
  },
  take: {
    presence: true,
    number: true,
    numericality: {
      onlyInteger: true,
      greaterThanOrEqualTo: 1,
      lessThanOrEqualTo: 300,
    },
  },
};

exports.presetSearch = {
  name: {
    presence: true,
    inclusion: constants.ALLOWED_SEARCH_PRESETS,
  },
  id: {
    string: true,
  },
};
