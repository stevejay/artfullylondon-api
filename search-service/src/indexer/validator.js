import { ensure } from "ensure-request";
import * as entityType from "../types/entity-type";

const DATE_REGEX = /^[12]\d\d\d-[01]\d-[0123]\d$/;
const TIME_REGEX = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
const OPTIONAL_BOOL = { bool: true };
const REQUIRED_BOOL = { ...OPTIONAL_BOOL, presence: true };
const OPTIONAL_STRING = { string: true };
const REQUIRED_STRING = { ...OPTIONAL_STRING, presence: true };
const OPTIONAL_DATE = { string: true, format: DATE_REGEX };
const REQUIRED_DATE = { ...OPTIONAL_DATE, presence: true };
const OPTIONAL_TIME = { string: true, format: TIME_REGEX };
const REQUIRED_TIME = { ...OPTIONAL_TIME, presence: true };
const OPTIONAL_NUMBER = { number: true };
const REQUIRED_NUMBER = { ...OPTIONAL_NUMBER, presence: true };

const REQUIRED_DAY_NUMBER = {
  presence: true,
  number: true,
  numericality: {
    onlyInteger: true,
    greaterThanOrEqualTo: 1,
    lessThanOrEqualTo: 7
  }
};

const TAGS_ARRAY_CONSTRAINT = {
  array: true,
  each: {
    object: {
      id: REQUIRED_STRING,
      label: REQUIRED_STRING
    }
  }
};

const EACH_DAY_RANGE_CONSTRAINT = {
  object: {
    day: REQUIRED_DAY_NUMBER,
    from: REQUIRED_TIME,
    to: REQUIRED_TIME,
    timesRangeId: OPTIONAL_STRING
  }
};

const EACH_DAY_AT_CONSTRAINT = {
  object: {
    day: REQUIRED_DAY_NUMBER,
    at: REQUIRED_TIME,
    timesRangeId: OPTIONAL_STRING
  }
};

const EACH_DATE_RANGE_CONSTRAINT = {
  object: {
    date: REQUIRED_DATE,
    from: REQUIRED_TIME,
    to: REQUIRED_TIME
  }
};

const EACH_DATE_OPTIONAL_RANGE_CONSTRAINT = {
  object: {
    date: REQUIRED_DATE,
    from: OPTIONAL_TIME,
    to: OPTIONAL_TIME
  }
};

const EACH_DATE_AT_CONSTRAINT = {
  object: {
    date: REQUIRED_DATE,
    at: REQUIRED_TIME
  }
};

const EACH_DATE_OPTIONAL_AT_CONSTRAINT = {
  object: {
    date: REQUIRED_DATE,
    at: OPTIONAL_TIME
  }
};

const ENTITY_BASIC_CONSTRAINT = {
  entityType: REQUIRED_STRING,
  id: REQUIRED_STRING,
  status: REQUIRED_STRING,
  version: REQUIRED_NUMBER,
  images: {
    array: true,
    each: {
      object: {
        id: REQUIRED_STRING,
        ratio: REQUIRED_NUMBER,
        copyright: OPTIONAL_STRING,
        dominantColor: OPTIONAL_STRING
      }
    }
  }
};

const TALENT_CONSTRAINT = {
  ...ENTITY_BASIC_CONSTRAINT,
  talentType: REQUIRED_STRING,
  firstNames: OPTIONAL_STRING,
  lastName: REQUIRED_STRING,
  commonRole: REQUIRED_STRING
};

const VENUE_CONSTRAINT = {
  ...ENTITY_BASIC_CONSTRAINT,
  name: REQUIRED_STRING,
  address: REQUIRED_STRING,
  postcode: REQUIRED_STRING,
  latitude: REQUIRED_NUMBER,
  longitude: REQUIRED_NUMBER,
  venueType: REQUIRED_STRING
};

const EVENT_SERIES_CONSTRAINT = {
  ...ENTITY_BASIC_CONSTRAINT,
  name: REQUIRED_STRING,
  eventSeriesType: REQUIRED_STRING,
  occurrence: REQUIRED_STRING,
  summary: REQUIRED_STRING
};

const EVENT_CONSTRAINT = {
  ...ENTITY_BASIC_CONSTRAINT,
  name: REQUIRED_STRING,
  summary: REQUIRED_STRING,
  eventType: REQUIRED_STRING,
  occurrenceType: REQUIRED_STRING,
  costType: REQUIRED_STRING,
  bookingType: REQUIRED_STRING,
  soldOut: OPTIONAL_BOOL,
  dateFrom: OPTIONAL_DATE,
  dateTo: OPTIONAL_DATE,
  rating: REQUIRED_NUMBER,
  minAge: OPTIONAL_NUMBER,
  maxAge: OPTIONAL_NUMBER,
  costFrom: OPTIONAL_NUMBER,
  venue: {
    object: {
      id: REQUIRED_STRING,
      name: REQUIRED_STRING,
      postcode: REQUIRED_STRING,
      latitude: REQUIRED_NUMBER,
      longitude: REQUIRED_NUMBER,
      openingTimes: {
        array: true,
        each: EACH_DAY_RANGE_CONSTRAINT
      },
      additionalOpeningTimes: {
        array: true,
        each: EACH_DATE_RANGE_CONSTRAINT
      },
      openingTimesClosures: {
        array: true,
        each: EACH_DATE_OPTIONAL_RANGE_CONSTRAINT
      },
      namedClosures: {
        array: true,
        each: REQUIRED_STRING
      }
    },
    presence: true
  },
  eventSeries: {
    object: {
      id: REQUIRED_STRING
    }
  },
  audienceTags: TAGS_ARRAY_CONSTRAINT,
  geoTags: TAGS_ARRAY_CONSTRAINT,
  mediumTags: TAGS_ARRAY_CONSTRAINT,
  styleTags: TAGS_ARRAY_CONSTRAINT,
  talents: {
    array: true,
    each: {
      object: {
        id: REQUIRED_STRING
      }
    }
  },
  links: {
    array: true,
    each: {
      object: {
        url: REQUIRED_STRING
      }
    }
  },
  useVenueOpeningTimes: REQUIRED_BOOL,
  timesRanges: {
    array: true,
    each: {
      object: {
        id: REQUIRED_STRING,
        dateFrom: REQUIRED_DATE,
        dateTo: REQUIRED_DATE,
        label: REQUIRED_STRING
      }
    }
  },
  openingTimes: {
    array: true,
    each: EACH_DAY_RANGE_CONSTRAINT
  },
  additionalOpeningTimes: {
    array: true,
    each: EACH_DATE_RANGE_CONSTRAINT
  },
  specialOpeningTimes: {
    array: true,
    each: {
      ...EACH_DATE_RANGE_CONSTRAINT,
      audienceTags: TAGS_ARRAY_CONSTRAINT
    }
  },
  openingTimesClosures: {
    array: true,
    each: EACH_DATE_OPTIONAL_RANGE_CONSTRAINT
  },
  performances: {
    array: true,
    each: EACH_DAY_AT_CONSTRAINT
  },
  additionalPerformances: {
    array: true,
    each: EACH_DATE_AT_CONSTRAINT
  },
  specialPerformances: {
    array: true,
    each: {
      ...EACH_DATE_AT_CONSTRAINT,
      audienceTags: TAGS_ARRAY_CONSTRAINT
    }
  },
  performancesClosures: {
    array: true,
    each: EACH_DATE_OPTIONAL_AT_CONSTRAINT
  },
  soldOutPerformances: {
    array: true,
    each: {
      object: {
        date: REQUIRED_DATE,
        at: REQUIRED_TIME
      }
    }
  }
};

const INDEX_DOCUMENT_CONSTRAINT = {
  entityType: {
    presence: true,
    inclusion: entityType.ALLOWED_VALUES
  },
  entity: {
    presence: true,
    object: {
      id: {
        string: true,
        presence: true,
        format: /^(event|event-series|talent|venue)\/.+/
      },
      entityType: {
        presence: true,
        inclusion: entityType.ALLOWED_VALUES
      },
      version: {
        number: true,
        presence: true,
        numericality: { onlyInteger: true, greaterThanOrEqualTo: 1 }
      }
    }
  }
};

function errorHandler(errors) {
  throw new Error("[400] Bad Request: " + errors.join("; "));
}

export function validateIndexDocumentRequest(request) {
  ensure(request, INDEX_DOCUMENT_CONSTRAINT, errorHandler);
}

export function validateTalent(talent) {
  ensure(talent, TALENT_CONSTRAINT, errorHandler);
}

export function validateVenue(venue) {
  ensure(venue, VENUE_CONSTRAINT, errorHandler);
}

export function validateEventSeries(eventSeries) {
  ensure(eventSeries, EVENT_SERIES_CONSTRAINT, errorHandler);
}

export function validateEvent(event) {
  ensure(event, EVENT_CONSTRAINT, errorHandler);
}
