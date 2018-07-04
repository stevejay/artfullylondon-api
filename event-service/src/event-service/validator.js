import _ from "lodash";
import { ensure } from "ensure-request";
import * as entityValidator from "../entity/validator";
import * as eventType from "../types/event-type";
import * as occurrenceType from "../types/occurrence-type";
import * as costType from "../types/cost-type";
import * as bookingType from "../types/booking-type";
import * as tagType from "../types/tag-type";
import * as statusType from "../types/status-type";

const PERFORMANCES_WITH_DATE_AT_ORDER = (current, next) =>
  next.date > current.date ||
  (next.date === current.date && next.at > current.at);

const REQUIRED_RATING = {
  number: true,
  presence: true,
  numericality: {
    onlyInteger: true,
    greaterThanOrEqualTo: 1,
    lessThanOrEqualTo: 5
  }
};

const OPTIONAL_AGE = {
  number: true,
  numericality: {
    onlyInteger: true,
    greaterThanOrEqualTo: 0,
    lessThanOrEqualTo: 99
  }
};

const OPTIONAL_COST = {
  number: true,
  numericality: {
    greaterThanOrEqualTo: 0,
    lessThanOrEqualTo: 999,
    pattern: /^[0-9]+(?:\.[0-9]{1,2})?$/
  }
};

const ADDITIONAL_PERFORMANCES = {
  array: true,
  length: { minimum: 1, maximum: 200 },
  ordered: PERFORMANCES_WITH_DATE_AT_ORDER,
  each: {
    object: {
      date: entityValidator.REQUIRED_DATE,
      at: entityValidator.REQUIRED_TIME
    }
  }
};

const OPTIONAL_TAGS = tagType => ({
  array: true,
  length: { minimum: 1, maximum: 20 },
  each: {
    object: {
      id: {
        ...entityValidator.REQUIRED_STRING,
        format: new RegExp(`^${tagType}\\/`)
      },
      label: {
        ...entityValidator.REQUIRED_STRING,
        format: /^\w[\w -]+\w$/
      }
    }
  }
});

const EVENT_VALIDATOR = {
  status: entityValidator.REQUIRED_ENUM(statusType.ALLOWED_VALUES),
  name: entityValidator.REQUIRED_STRING,
  eventType: {
    ...entityValidator.REQUIRED_ENUM(eventType.ALLOWED_VALUES),
    dependency: [
      {
        test: value => value === eventType.PERFORMANCE,
        ensure: (__, attrs) =>
          _.includes(
            occurrenceType.ALLOWED_PERFORMANCE_VALUES,
            attrs.occurrenceType
          ),
        message: "Occurrence type is not valid for performance event"
      },
      {
        test: value => value === eventType.COURSE,
        ensure: (__, attrs) =>
          _.includes(
            occurrenceType.ALLOWED_COURSE_VALUES,
            attrs.occurrenceType
          ),
        message: "Occurrence type is not valid for course event"
      },
      {
        test: value => value === eventType.EXHIBITION,
        ensure: (__, attrs) =>
          _.includes(
            occurrenceType.ALLOWED_EXHIBITION_VALUES,
            attrs.occurrenceType
          ),
        message: "Occurrence type is not valid for exhibition event"
      }
    ]
  },
  occurrenceType: {
    ...entityValidator.REQUIRED_ENUM(occurrenceType.ALLOWED_VALUES),
    dependency: [
      {
        test: value => value === occurrenceType.ONE_TIME,
        ensure: (__, attrs) =>
          attrs.dateFrom && attrs.dateFrom === attrs.dateTo,
        message: "Date from must equal date to and both must be given"
      },
      {
        test: value => value === occurrenceType.BOUNDED,
        ensure: (__, attrs) => attrs.dateFrom && attrs.dateTo >= attrs.dateFrom,
        message:
          "Date to must be greater than or equal to date from and both must be given"
      },
      {
        test: value => value === occurrenceType.CONTINUOUS,
        ensure: (__, attrs) => _.isNil(attrs.dateFrom) && _.isNil(attrs.dateTo),
        message: "Date from and date to must be null"
      }
    ]
  },
  dateFrom: entityValidator.OPTIONAL_DATE,
  dateTo: entityValidator.OPTIONAL_DATE,
  soldOut: entityValidator.OPTIONAL_BOOL,
  summary: entityValidator.REQUIRED_STRING,
  description: entityValidator.OPTIONAL_LONG_STRING,
  descriptionCredit: entityValidator.OPTIONAL_STRING,
  rating: REQUIRED_RATING,
  minAge: OPTIONAL_AGE,
  maxAge: {
    ...OPTIONAL_AGE,
    dependency: {
      test: (value, attrs) => !_.isNil(value) && !_.isNil(attrs.minAge),
      ensure: (value, attrs) => value >= attrs.minAge,
      message: "Max age must be greater than or equal to Min age"
    }
  },
  costType: {
    ...entityValidator.REQUIRED_ENUM(costType.ALLOWED_VALUES),
    dependency: [
      {
        test: value => value === costType.FREE,
        ensure: (__, attrs) => _.isNil(attrs.costFrom) && _.isNil(attrs.costTo),
        message: "Cost from and cost to must be null"
      },
      {
        test: value => value === costType.PAID,
        ensure: (__, attrs) =>
          attrs.costFrom >= 0 && attrs.costTo >= attrs.costFrom,
        message:
          "Cost to must be greater than or equal to cost from and both must be given"
      }
    ]
  },
  costFrom: OPTIONAL_COST,
  costTo: OPTIONAL_COST,
  bookingType: {
    ...entityValidator.REQUIRED_ENUM(bookingType.ALLOWED_VALUES),
    dependency: {
      test: value => value === bookingType.NOT_REQUIRED,
      ensure: (__, attrs) => _.isNil(attrs.bookingOpens),
      message: "Booking opens must be null"
    }
  },
  bookingOpens: entityValidator.OPTIONAL_DATE,
  timedEntry: {
    bool: true,
    dependency: {
      test: value => !!value,
      ensure: (__, attrs) => attrs.eventType === eventType.EXHIBITION,
      message: "Only exhibition events can have the timed entry flag set"
    }
  },
  duration: entityValidator.OPTIONAL_TIME,
  eventSeriesId: entityValidator.OPTIONAL_STRING,
  venueId: entityValidator.REQUIRED_STRING,
  venueGuidance: entityValidator.OPTIONAL_STRING,
  useVenueOpeningTimes: {
    ...entityValidator.REQUIRED_BOOL,
    dependency: {
      test: value => !!value,
      ensure: (__, attrs) => attrs.eventType === eventType.EXHIBITION,
      message:
        "Cannot use venue opening times if event is a performance or a course"
    }
  },
  timesRanges: {
    array: true,
    length: { minimum: 1, maximum: 200 },
    ordered: (current, next) => next.dateFrom > current.dateTo,
    each: {
      object: {
        id: entityValidator.REQUIRED_STRING,
        dateFrom: entityValidator.REQUIRED_DATE,
        dateTo: {
          ...entityValidator.REQUIRED_DATE,
          dependency: {
            ensure: (value, attrs) => value > attrs.dateFrom,
            message:
              "For each times range, Date To must be greater than Date From"
          }
        },
        label: entityValidator.REQUIRED_STRING
      }
    },
    dependency: [
      {
        test: value => value && value.length > 0,
        ensure: (__, attrs) => attrs.occurrenceType === occurrenceType.BOUNDED,
        message: "Can only have Times Ranges if event is bounded"
      },
      {
        test: value => value && value.length > 0,
        ensure: (value, attrs) => value[0].dateFrom === attrs.dateFrom,
        message: "Date From of first times range must equal event Date From"
      },
      {
        test: value => value && value.length > 0,
        ensure: (value, attrs) =>
          value[value.length - 1].dateTo === attrs.dateTo,
        message: "Date To of last times range must equal event Date To"
      },
      {
        test: value => value && value.length > 0,
        ensure: (value, attrs) =>
          (attrs.eventType === eventType.EXHIBITION &&
            (attrs.useVenueOpeningTimes ||
              _.every(attrs.openingTimes, x =>
                _.find(value, y => y.id === x.timesRangeId)
              ))) ||
          (attrs.eventType === eventType.PERFORMANCE &&
            _.every(attrs.performances, x =>
              _.find(value, y => y.id === x.timesRangeId)
            )),
        message:
          "All Opening Times / Performances must have a recognized Times Range Id"
      }
    ]
  },
  openingTimes: entityValidator.OPENING_TIMES,
  additionalOpeningTimes: entityValidator.ADDITIONAL_OPENING_TIMES,
  specialOpeningTimes: {
    ...entityValidator.ADDITIONAL_OPENING_TIMES,
    each: {
      object: {
        ...entityValidator.ADDITIONAL_OPENING_TIMES.each.object,
        audienceTags: OPTIONAL_TAGS(tagType.AUDIENCE)
      }
    }
  },
  openingTimesClosures: entityValidator.OPENING_TIMES_CLOSURES,
  performances: {
    array: true,
    length: { minimum: 1, maximum: 200 },
    ordered: (current, next) =>
      next.day > current.day ||
      (next.day === current.day && next.at > current.at),
    each: {
      object: {
        day: entityValidator.REQUIRED_DAY_NUMBER,
        at: entityValidator.REQUIRED_TIME,
        timesRangeId: entityValidator.OPTIONAL_STRING
      }
    }
  },
  additionalPerformances: ADDITIONAL_PERFORMANCES,
  specialPerformances: {
    ...ADDITIONAL_PERFORMANCES,
    each: {
      object: {
        ...ADDITIONAL_PERFORMANCES.each.object,
        audienceTags: OPTIONAL_TAGS(tagType.AUDIENCE)
      }
    }
  },
  performancesClosures: {
    array: true,
    length: { minimum: 1, maximum: 200 },
    ordered: (current, next) =>
      next.date > current.date ||
      (next.date === current.date && next.at > current.at),
    each: {
      object: {
        date: entityValidator.REQUIRED_DATE,
        at: entityValidator.OPTIONAL_DATE
      }
    }
  },
  talents: {
    array: true,
    length: { minimum: 1, maximum: 50 },
    each: {
      object: {
        id: entityValidator.REQUIRED_STRING,
        roles: {
          array: true,
          presence: true,
          length: { minimum: 1, maximum: 10 },
          each: {
            string: true,
            presence: true,
            format: /^\w.+\w$/,
            length: { minimum: 1, maximum: 100 }
          }
        },
        characters: {
          array: true,
          length: { minimum: 1, maximum: 10 },
          each: {
            string: true,
            presence: true,
            format: /^\w.+\w$/,
            length: { minimum: 1, maximum: 100 }
          }
        }
      }
    }
  },
  audienceTags: OPTIONAL_TAGS(tagType.AUDIENCE),
  geoTags: OPTIONAL_TAGS(tagType.GEO),
  mediumTags: OPTIONAL_TAGS(tagType.MEDIUM),
  styleTags: OPTIONAL_TAGS(tagType.STYLE),
  links: entityValidator.LINKS,
  images: entityValidator.IMAGES,
  reviews: {
    array: true,
    length: { maximum: 5 },
    each: {
      object: {
        source: entityValidator.REQUIRED_STRING,
        rating: REQUIRED_RATING
      }
    }
  },
  weSay: entityValidator.OPTIONAL_STRING,
  notes: entityValidator.OPTIONAL_STRING,
  soldOutPerformances: {
    array: true,
    length: { maximum: 1000 },
    each: {
      object: {
        date: entityValidator.REQUIRED_DATE,
        at: entityValidator.REQUIRED_TIME
      }
    },
    dependency: {
      test: value => value && value.length > 0,
      ensure: (__, attrs) => attrs.eventType === eventType.PERFORMANCE,
      message: "Can only have sold out performances if event is a performance"
    }
  },
  version: entityValidator.REQUIRED_VERSION,
  createdDate: entityValidator.OPTIONAL_DATE,
  updatedDate: entityValidator.OPTIONAL_DATE
};

function errorHandler(errors) {
  throw new Error("[400] Bad Request: " + errors.join("; "));
}

export function validateCreateOrUpdateEventRequest(request) {
  ensure(request, EVENT_VALIDATOR, errorHandler);
}
