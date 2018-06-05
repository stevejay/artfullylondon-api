"use strict";

const constants = require("../constants");
import * as entityType from "../entity-type";

exports.autocompleteSearch = {
  term: {
    trim: true,
    simplify: true
  },
  entityType: {
    default: entityType.ALL
  }
};

exports.basicSearch = {
  term: {
    trim: true,
    undefinedIfEmpty: true
  },
  entityType: {
    default: entityType.ALL
  },
  location: {
    object: {
      north: { toFloat: true },
      west: { toFloat: true },
      south: { toFloat: true },
      east: { toFloat: true }
    }
  },
  skip: {
    default: 0,
    toInt: true
  },
  take: {
    default: constants.SEARCH_RESULTS_DEFAULT_PAGE_SIZE,
    toInt: true
  }
};

exports.eventAdvancedSearch = {
  term: {
    trim: true,
    undefinedIfEmpty: true
  },
  dateFrom: {
    undefinedIfEmpty: true
  },
  dateTo: {
    undefinedIfEmpty: true
  },
  timeFrom: {
    undefinedIfEmpty: true
  },
  timeTo: {
    undefinedIfEmpty: true
  },
  area: {
    undefinedIfEmpty: true
  },
  medium: {
    undefinedIfEmpty: true
  },
  style: {
    undefinedIfEmpty: true
  },
  audience: {
    undefinedIfEmpty: true
  },
  cost: {
    undefinedIfEmpty: true
  },
  booking: {
    undefinedIfEmpty: true
  },
  location: {
    object: {
      north: { toFloat: true },
      west: { toFloat: true },
      south: { toFloat: true },
      east: { toFloat: true }
    }
  },
  venueId: {
    undefinedIfEmpty: true
  },
  talentId: {
    undefinedIfEmpty: true
  },
  skip: {
    default: 0,
    toInt: true
  },
  take: {
    default: constants.SEARCH_RESULTS_DEFAULT_PAGE_SIZE,
    toInt: true
  }
};
