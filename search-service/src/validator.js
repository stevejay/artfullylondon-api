import { ensure } from "ensure-request";
import * as entityType from "./types/entity-type";
import * as costType from "./types/cost-type";
import * as areaType from "./types/area-type";
import * as bookingType from "./types/booking-type";
import * as presetSearchType from "./types/preset-search-type";

const DATE_REGEX = /^[12]\d\d\d-[01]\d-[0123]\d$/;
const TIME_REGEX = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
const MEDIUM_TAG_REGEX = /^(?:medium\/[^/\s]+|:all-visual|:all-performing|:all-creative-writing)$/;
const STYLE_TAG_REGEX = /^style\/[^/\s]+$/;
const AUDIENCE_TAG_REGEX = /^audience\/[^/\s]+$/;

const TERM_LENGTH = { minimum: 1, maximum: 100 };
const ID_LENGTH = { minimum: 1, maximum: 300 };

const LATITUDE_NUMERICALITY = {
  greaterThanOrEqualTo: -90,
  lessThanOrEqualTo: 90
};

const LONGITUDE_NUMERICALITY = {
  greaterThanOrEqualTo: -180,
  lessThanOrEqualTo: 180
};

const LOCATION_CONSTRAINT = {
  object: {
    north: {
      presence: true,
      numericality: LATITUDE_NUMERICALITY
    },
    west: {
      presence: true,
      numericality: LONGITUDE_NUMERICALITY
    },
    south: {
      presence: true,
      numericality: LATITUDE_NUMERICALITY,
      dependency: {
        ensure: (value, attrs) => value < attrs.north,
        message: "south value must be less than north value"
      }
    },
    east: {
      presence: true,
      numericality: LONGITUDE_NUMERICALITY,
      dependency: {
        ensure: (value, attrs) => value > attrs.west,
        message: "east value must be greater than west value"
      }
    }
  }
};

const SKIP_CONSTRAINT = {
  presence: true,
  number: true,
  numericality: { onlyInteger: true, greaterThanOrEqualTo: 0 }
};

const TAKE_CONSTRAINT = {
  presence: true,
  number: true,
  numericality: {
    onlyInteger: true,
    greaterThanOrEqualTo: 1,
    lessThanOrEqualTo: 300
  }
};

const AUTOCOMPLETE_SEARCH_CONSTRAINT = {
  term: {
    string: true,
    presence: true,
    length: TERM_LENGTH
  },
  entityType: {
    string: true,
    inclusion: entityType.ALLOWED_VALUES
  }
};

const BASIC_SEARCH_CONSTRAINT = {
  term: {
    string: true,
    length: TERM_LENGTH
  },
  entityType: {
    presence: true,
    string: true,
    inclusion: entityType.ALLOWED_VALUES,
    dependency: [
      {
        test: value => !value || value === entityType.ALL,
        ensure: (_, attrs) => attrs.skip === 0,
        message: "Skip must be zero or not included when searching all entities"
      },
      {
        test: value => value !== entityType.VENUE,
        ensure: (_, attrs) =>
          !attrs.north && !attrs.south && !attrs.east && !attrs.west,
        message: "location can only be included when entityType value is venue"
      }
    ]
  },
  location: LOCATION_CONSTRAINT,
  skip: SKIP_CONSTRAINT,
  take: TAKE_CONSTRAINT
};

const EVENT_ADVANCED_SEARCH_CONSTRAINT = {
  term: {
    string: true,
    length: TERM_LENGTH
  },
  dateFrom: {
    string: true,
    format: DATE_REGEX
  },
  dateTo: {
    string: true,
    format: DATE_REGEX,
    dependency: {
      ensure: (value, attrs) =>
        !value || !attrs.dateFrom || value >= attrs.dateFrom,
      message: "dateTo must be greater than or equal to dateFrom"
    }
  },
  timeFrom: {
    string: true,
    format: TIME_REGEX
  },
  timeTo: {
    string: true,
    format: TIME_REGEX,
    dependency: {
      ensure: (value, attrs) =>
        !value || !attrs.timeFrom || value >= attrs.timeFrom,
      message: "timeTo must be greater than or equal to timeFrom"
    }
  },
  medium: {
    string: true,
    format: MEDIUM_TAG_REGEX
  },
  style: {
    string: true,
    format: STYLE_TAG_REGEX,
    dependency: {
      ensure: (value, attrs) =>
        !value || (!!attrs.medium && attrs.medium.indexOf("medium/") === 0),
      message: "Cannot have style tag and no medium tag"
    }
  },
  audience: {
    string: true,
    format: AUDIENCE_TAG_REGEX
  },
  cost: {
    string: true,
    inclusion: costType.ALLOWED_VALUES
  },
  booking: {
    string: true,
    inclusion: bookingType.ALLOWED_VALUES
  },
  area: {
    string: true,
    inclusion: areaType.ALLOWED_VALUES
  },
  location: LOCATION_CONSTRAINT,
  venueId: {
    string: true,
    length: ID_LENGTH
  },
  talentId: {
    string: true,
    length: ID_LENGTH
  },
  skip: SKIP_CONSTRAINT,
  take: TAKE_CONSTRAINT
};

const PRESET_SEARCH_CONSTRAINT = {
  name: {
    presence: true,
    inclusion: presetSearchType.ALLOWED_VALUES
  },
  id: {
    string: true
  }
};

const INDEX_DOCUMENT_CONSTRAINT = {
  entityType: {
    string: true,
    presence: true,
    inclusion: entityType.ALLOWED_VALUES
  },
  entity: {
    presence: true,
    object: {
      id: {
        string: true,
        presence: true
      },
      entityType: {
        string: true,
        presence: true
      }
    }
  }
};

function errorHandler(errors) {
  throw new Error("[400] Bad Request: " + errors.join("; "));
}

export function validateAutocompleteSearchRequest(request) {
  ensure(request, AUTOCOMPLETE_SEARCH_CONSTRAINT, errorHandler);
}

export function validateBasicSearchRequest(request) {
  ensure(request, BASIC_SEARCH_CONSTRAINT, errorHandler);
}

export function validateEventAdvancedSearchRequest(request) {
  ensure(request, EVENT_ADVANCED_SEARCH_CONSTRAINT, errorHandler);
}

export function validatePresetSearch(request) {
  ensure(request, PRESET_SEARCH_CONSTRAINT, errorHandler);
}

export function validateIndexDocumentRequest(request) {
  ensure(request, INDEX_DOCUMENT_CONSTRAINT, errorHandler);
}
