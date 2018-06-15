import normalise from "normalise-request";
import simplify from "es-simplify";
import * as entityType from "./types/entity-type";

const SEARCH_RESULTS_DEFAULT_PAGE_SIZE = 12;

normalise.normalisers.simplify = param =>
  typeof param !== "string" ? param : simplify(param);

const AUTOCOMPLETE_SEARCH_NORMALISER = {
  admin: {
    undefinedIfEmpty: true,
    toBool: true
  },
  term: {
    trim: true,
    simplify: true
  },
  entityType: {
    undefinedIfEmpty: true,
    default: entityType.ALL
  }
};

const BASIC_SEARCH_NORMALISER = {
  admin: {
    undefinedIfEmpty: true,
    toBool: true
  },
  term: {
    trim: true,
    undefinedIfEmpty: true
  },
  entityType: {
    undefinedIfEmpty: true,
    default: entityType.ALL
  },
  north: {
    undefinedIfEmpty: true,
    toFloat: true
  },
  west: {
    undefinedIfEmpty: true,
    toFloat: true
  },
  south: {
    undefinedIfEmpty: true,
    toFloat: true
  },
  east: {
    undefinedIfEmpty: true,
    toFloat: true
  },
  skip: {
    undefinedIfEmpty: true,
    default: 0,
    toInt: true
  },
  take: {
    undefinedIfEmpty: true,
    default: SEARCH_RESULTS_DEFAULT_PAGE_SIZE,
    toInt: true
  }
};

const EVENT_ADVANCED_SEARCH_NORMALISER = {
  admin: {
    undefinedIfEmpty: true,
    toBool: true
  },
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
    default: SEARCH_RESULTS_DEFAULT_PAGE_SIZE,
    toInt: true
  }
};

const PRESET_SEARCH_NORMALISER = {
  admin: {
    undefinedIfEmpty: true,
    toBool: true
  }
};

export function normaliseAutocompleteSearchRequest(request) {
  return normalise({ ...request }, AUTOCOMPLETE_SEARCH_NORMALISER);
}

export function normaliseBasicSearchRequest(request) {
  return normalise({ ...request }, BASIC_SEARCH_NORMALISER);
}

export function normaliseEventAdvancedSearchRequest(request) {
  return normalise({ ...request }, EVENT_ADVANCED_SEARCH_NORMALISER);
}

export function normalisePresetSearchRequest(request) {
  return normalise({ ...request }, PRESET_SEARCH_NORMALISER);
}
