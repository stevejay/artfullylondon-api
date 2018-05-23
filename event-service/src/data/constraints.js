'use strict';

const isNil = require('lodash.isnil');
const globalConstants = require('../constants');

const LONDON_LAT = 51.5074;
const LONDON_LAT_RANGE = 0.3;
const LONDON_LNG = 0.1278;
const LONDON_LNG_RANGE = 0.6;

exports.LONDON_LATITUDE_NUMERICALITY = {
  greaterThanOrEqualTo: LONDON_LAT - LONDON_LAT_RANGE,
  lessThanOrEqualTo: LONDON_LAT + LONDON_LAT_RANGE,
};

exports.LONDON_LONGITUDE_NUMERICALITY = {
  greaterThanOrEqualTo: LONDON_LNG - LONDON_LNG_RANGE,
  lessThanOrEqualTo: LONDON_LNG + LONDON_LNG_RANGE,
};

exports.DATE_REGEX = /^[12]\d\d\d\/[01]\d\/[0123]\d$/;
exports.TIME_REGEX = /^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/;
exports.MONEY_REGEX = /^[0-9]+(?:\.[0-9]{1,2})?$/;
exports.TAG_LABEL_REGEX = /^\w[\w -]+\w$/;
exports.TALENT_ROLE_REGEX = /^\w.+\w$/;
exports.TALENT_CHARACTER_REGEX = /^\w.+\w$/;
exports.AUDIENCE_TAG_ID_REGEX = /^audience\//;
exports.GEO_TAG_ID_REGEX = /^geo\//;
exports.MEDIUM_TAG_ID_REGEX = /^medium\//;
exports.STYLE_TAG_ID_REGEX = /^style\//;
exports.TELEPHONE_REGEX = /^\d[\d\s-]{6,18}\d$/;
exports.POSTCODE_REGEX = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s+[0-9][A-Z]{2}$/;
exports.HEX_COLOR_REGEX = /^[a-f0-9]{6}$/;

exports.ID_LENGTH = { minimum: 1, maximum: 300 };
exports.NAME_LENGTH = { minimum: 1, maximum: 200 };
exports.SUMMARY_LENGTH = { minimum: 1, maximum: 140 };
exports.DESCRIPTION_LENGTH = { minimum: 1, maximum: 5000 };
exports.ADDITIONAL_INFO_LENGTH = { minimum: 1, maximum: 200 };
exports.TAG_LABEL_LENGTH = { minimum: 1, maximum: 50 };
exports.TAGS_LENGTH = { minimum: 1, maximum: 20 };
exports.IMAGES_LENGTH = { minimum: 1, maximum: 10 };
exports.WE_SAY_LENGTH = { minimum: 1, maximum: 300 };
exports.LINKS_LENGTH = {
  minimum: 1,
  maximum: globalConstants.ALLOWED_LINK_TYPES.length,
};
exports.URL_LENGTH = { minimum: 1, maximum: 200 };
exports.TALENT_LENGTH = { minimum: 1, maximum: 20 };
exports.TALENT_ROLES_LENGTH = { minimum: 1, maximum: 10 };
exports.TALENT_ROLE_LENGTH = { minimum: 1, maximum: 50 };
exports.TIMES_ARRAY_LENGTH = { minimum: 1, maximum: 200 };
exports.TALENT_CHARACTERS_LENGTH = { minimum: 1, maximum: 10 };
exports.TALENT_CHARACTER_LENGTH = { minimum: 1, maximum: 50 };
exports.EMAIL_LENGTH = { maximum: 100 };
exports.ADDRESS_LENGTH = { minimum: 1, maximum: 400 };
exports.NOTES_LENGTH = { maximum: 400 };
exports.REVIEWS_ARRAY_LENGTH = { maximum: 5 };
exports.SOLD_OUT_PERFORMANCES_ARRAY_LENGTH = { maximum: 1000 };

exports.DAY_NUMBER_NUMERICALITY = {
  onlyInteger: true,
  greaterThanOrEqualTo: 0,
  lessThanOrEqualTo: 6,
};
exports.RATING_NUMERICALITY = {
  onlyInteger: true,
  greaterThanOrEqualTo: 1,
  lessThanOrEqualTo: 5,
};
exports.AGE_NUMERICALITY = {
  onlyInteger: true,
  greaterThanOrEqualTo: 0,
  lessThanOrEqualTo: 99,
};
exports.COST_NUMERICALITY = {
  greaterThanOrEqualTo: 0,
  lessThanOrEqualTo: 999,
  pattern: exports.MONEY_REGEX,
};
exports.IMAGE_RATIO_NUMERICALITY = { greaterThan: 0 };
exports.VERSION_NUMERICALITY = { onlyInteger: true, greaterThanOrEqualTo: 1 };

exports.LINK_URL_DEPENDENCY_ON_LINK_TYPE = {
  ensure: (value, attrs) => isValidUrlForLinkType(value, attrs.type),
  message: 'Url is not valid for link type',
};

function noQueryString(url) {
  return url.indexOf('?') === -1;
}

function isValidUrlForLinkType(url, linkType) {
  switch (linkType) {
    case globalConstants.LINK_TYPE_WIKIPEDIA:
      return url.startsWith('https://en.wikipedia.org/') && noQueryString(url);
    case globalConstants.LINK_TYPE_FACEBOOK:
      return url.startsWith('https://www.facebook.com/') && noQueryString(url);
    case globalConstants.LINK_TYPE_TWITTER:
      return url.startsWith('https://twitter.com/') && noQueryString(url);
    case globalConstants.LINK_TYPE_INSTAGRAM:
      return url.startsWith('https://www.instagram.com/') && noQueryString(url);
    default:
      return true;
  }
}

exports.TO_OPENING_TIME_DEPENDENCY_ON_FROM_OPENING_TIME = {
  ensure: (value, attrs) => value > attrs.from,
  message: 'To time is not greater than from time',
};

exports.OPTIONAL_TO_OPENING_TIME_DEPENDENCY_ON_FROM_OPENING_TIME = {
  ensure: (value, attrs) =>
    (isNil(attrs.from) && isNil(value)) || value > attrs.from,
  message: 'To time is not greater than from time',
};

exports.TIMES_RANGES_ORDER = (current, next) => next.dateFrom > current.dateTo;

exports.OPENING_TIMES_ORDER = (current, next) =>
  next.day > current.day ||
  (next.day === current.day && next.from > current.to);

exports.OPENING_TIMES_WITH_DATE_RANGE_ORDER = (current, next) =>
  next.date > current.date ||
  (next.date === current.date && next.from > current.to);

exports.OPENING_TIMES_CLOSURES_ORDER = (current, next) =>
  next.date > current.date ||
  (next.date === current.date && next.from > current.to);

exports.PERFORMANCES_ORDER = (current, next) =>
  next.day > current.day || (next.day === current.day && next.at > current.at);

exports.PERFORMANCES_WITH_DATE_AT_ORDER = (current, next) =>
  next.date > current.date ||
  (next.date === current.date && next.at > current.at);

exports.PERFORMANCES_CLOSURES_ORDER = (current, next) =>
  next.date > current.date ||
  (next.date === current.date && next.at > current.at);

exports.EACH_IMAGE_CONSTRAINT = {
  object: {
    id: {
      uuid: true,
      presence: true,
    },
    ratio: {
      number: true,
      presence: true,
      numericality: exports.IMAGE_RATIO_NUMERICALITY,
    },
    copyright: {
      string: true,
      length: exports.ADDITIONAL_INFO_LENGTH,
    },
    dominantColor: {
      string: true,
      format: exports.HEX_COLOR_REGEX,
    },
  },
};

exports.EACH_LINK_CONSTRAINT = {
  object: {
    type: {
      string: true,
      presence: true,
      inclusion: globalConstants.ALLOWED_LINK_TYPES,
    },
    url: {
      url: true,
      presence: true,
      length: exports.URL_LENGTH,
      dependency: exports.LINK_URL_DEPENDENCY_ON_LINK_TYPE,
    },
  },
};

exports.EACH_DAY_RANGE_CONSTRAINT = {
  object: {
    day: {
      presence: true,
      number: true,
      numericality: exports.DAY_NUMBER_NUMERICALITY,
    },
    from: {
      presence: true,
      string: true,
      format: exports.TIME_REGEX,
    },
    to: {
      presence: true,
      string: true,
      format: exports.TIME_REGEX,
      dependency: exports.TO_OPENING_TIME_DEPENDENCY_ON_FROM_OPENING_TIME,
    },
    timesRangeId: {
      string: true,
    },
  },
};

exports.EACH_DAY_AT_CONSTRAINT = {
  object: {
    day: {
      presence: true,
      number: true,
      numericality: exports.DAY_NUMBER_NUMERICALITY,
    },
    at: {
      presence: true,
      string: true,
      format: exports.TIME_REGEX,
    },
    timesRangeId: {
      string: true,
    },
  },
};

exports.EACH_DATE_RANGE_CONSTRAINT = {
  object: {
    date: {
      presence: true,
      string: true,
      format: exports.DATE_REGEX,
    },
    from: {
      presence: true,
      string: true,
      format: exports.TIME_REGEX,
    },
    to: {
      presence: true,
      string: true,
      format: exports.TIME_REGEX,
      dependency: exports.TO_OPENING_TIME_DEPENDENCY_ON_FROM_OPENING_TIME,
    },
  },
};

exports.EACH_DATE_OPTIONAL_RANGE_CONSTRAINT = {
  object: {
    date: {
      presence: true,
      string: true,
      format: exports.DATE_REGEX,
    },
    from: {
      string: true,
      format: exports.TIME_REGEX,
    },
    to: {
      string: true,
      format: exports.TIME_REGEX,
      dependency: exports.OPTIONAL_TO_OPENING_TIME_DEPENDENCY_ON_FROM_OPENING_TIME,
    },
  },
};

exports.EACH_DATE_AT_CONSTRAINT = {
  object: {
    date: {
      presence: true,
      string: true,
      format: exports.DATE_REGEX,
    },
    at: {
      presence: true,
      string: true,
      format: exports.TIME_REGEX,
    },
  },
};

exports.EACH_DATE_OPTIONAL_AT_CONSTRAINT = {
  object: {
    date: {
      presence: true,
      string: true,
      format: exports.DATE_REGEX,
    },
    at: {
      string: true,
      format: exports.TIME_REGEX,
    },
  },
};

function _getTagFormatConstraint(tagType) {
  switch (tagType) {
    case globalConstants.TAG_TYPE_STYLE:
      return exports.STYLE_TAG_ID_REGEX;
    case globalConstants.TAG_TYPE_MEDIUM:
      return exports.MEDIUM_TAG_ID_REGEX;
    case globalConstants.TAG_TYPE_AUDIENCE:
      return exports.AUDIENCE_TAG_ID_REGEX;
    case globalConstants.TAG_TYPE_GEO:
      return exports.GEO_TAG_ID_REGEX;
    default:
      throw new Error(`tagType not found: ${tagType}`);
  }
}

exports.EACH_TAG_CONSTRAINT = tagType => ({
  object: {
    id: {
      string: true,
      presence: true,
      format: _getTagFormatConstraint(tagType),
      length: exports.ID_LENGTH,
    },
    label: {
      string: true,
      presence: true,
      format: exports.TAG_LABEL_REGEX,
      length: exports.TAG_LABEL_LENGTH,
    },
  },
});
