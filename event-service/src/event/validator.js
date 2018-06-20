import _ from "lodash";
import { ensure } from "ensure-request";
import * as entityValidator from "../entity/validator";
import * as eventType from "../types/event-type";
import * as occurrenceType from "../types/occurrence-type";
import * as costType from "../types/cost-type";
import * as bookingType from "../types/booking-type";
import * as tagType from "../types/tag-type";

const PERFORMANCES_WITH_DATE_AT_ORDER = (current, next) =>
  next.date > current.date ||
  (next.date === current.date && next.at > current.at);

const RATING_CONSTRAINT = {
  number: true,
  presence: true,
  numericality: {
    onlyInteger: true,
    greaterThanOrEqualTo: 1,
    lessThanOrEqualTo: 5
  }
};

const AGE_CONSTRAINT = {
  number: true,
  numericality: {
    onlyInteger: true,
    greaterThanOrEqualTo: 0,
    lessThanOrEqualTo: 99
  }
};

const COST_CONSTRAINT = {
  number: true,
  numericality: {
    greaterThanOrEqualTo: 0,
    lessThanOrEqualTo: 999,
    pattern: /^[0-9]+(?:\.[0-9]{1,2})?$/
  }
};

const ADDITIONAL_PERFORMANCES_CONSTRAINT = {
  array: true,
  length: { minimum: 1, maximum: 200 },
  ordered: PERFORMANCES_WITH_DATE_AT_ORDER,
  each: entityValidator.EACH_DATE_AT_CONSTRAINT
};

const AUDIENCE_TAGS_CONSTRAINT = {
  each: entityValidator.EACH_TAG_CONSTRAINT(tagType.AUDIENCE)
};

const EVENT_CONSTRAINT = {
  status: entityValidator.STATUS_VALIDATOR,
  name: entityValidator.REQUIRED_NAME_CONSTRAINT,
  eventType: {
    presence: true,
    inclusion: eventType.ALLOWED_VALUES,
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
    presence: true,
    inclusion: occurrenceType.ALLOWED_VALUES,
    dependency: [
      {
        test: value => value === occurrenceType.ONETIME,
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
  dateFrom: entityValidator.OPTIONAL_DATE_CONSTRAINT,
  dateTo: entityValidator.OPTIONAL_DATE_CONSTRAINT,
  soldOut: { bool: true },
  summary: entityValidator.SUMMARY_CONSTRAINT,
  description: entityValidator.DESCRIPTION_CONSTRAINT,
  descriptionCredit: entityValidator.OPTIONAL_ADDITIONAL_INFO_CONSTRAINT,
  rating: RATING_CONSTRAINT,
  minAge: AGE_CONSTRAINT,
  maxAge: {
    ...AGE_CONSTRAINT,
    dependency: {
      test: (value, attrs) => !_.isNil(value) && !_.isNil(attrs.minAge),
      ensure: (value, attrs) => value >= attrs.minAge,
      message: "Max age must be greater than or equal to Min age"
    }
  },
  costType: {
    presence: true,
    inclusion: costType.ALLOWED_VALUES,
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
  costFrom: COST_CONSTRAINT,
  costTo: COST_CONSTRAINT,
  bookingType: {
    presence: true,
    inclusion: bookingType.ALLOWED_VALUES,
    dependency: {
      test: value => value === bookingType.NOT_REQUIRED,
      ensure: (__, attrs) => _.isNil(attrs.bookingOpens),
      message: "Booking opens must be null"
    }
  },
  bookingOpens: entityValidator.OPTIONAL_DATE_CONSTRAINT,
  timedEntry: {
    bool: true,
    dependency: {
      test: value => !!value,
      ensure: (__, attrs) => attrs.eventType === eventType.EXHIBITION,
      message: "Only exhibition events can have the timed entry flag set"
    }
  },
  duration: entityValidator.OPTIONAL_TIME_CONSTRAINT,
  eventSeriesId: entityValidator.OPTIONAL_ID_CONSTRAINT,
  venueId: entityValidator.REQUIRED_ID_CONSTRAINT,
  venueGuidance: entityValidator.OPTIONAL_ADDITIONAL_INFO_CONSTRAINT,
  useVenueOpeningTimes: {
    bool: true,
    presence: true,
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
        id: entityValidator.REQUIRED_ID_CONSTRAINT,
        dateFrom: entityValidator.REQUIRED_DATE_CONSTRAINT,
        dateTo: {
          ...entityValidator.REQUIRED_DATE_CONSTRAINT,
          dependency: {
            ensure: (value, attrs) => value > attrs.dateFrom,
            message:
              "For each times range, Date To must be greater than Date From"
          }
        },
        label: entityValidator.REQUIRED_ADDITIONAL_INFO_CONSTRAINT
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
  openingTimes: entityValidator.OPENING_TIMES_CONSTRAINT,
  additionalOpeningTimes: entityValidator.ADDITIONAL_OPENING_TIMES_CONSTRAINT,
  specialOpeningTimes: {
    ...entityValidator.ADDITIONAL_OPENING_TIMES_CONSTRAINT,
    each: {
      ...entityValidator.ADDITIONAL_OPENING_TIMES_CONSTRAINT.each,
      audienceTags: AUDIENCE_TAGS_CONSTRAINT
    }
  },
  openingTimesClosures: entityValidator.OPENING_TIMES_CLOSURES_CONSTRAINT,
  performances: {
    array: true,
    length: { minimum: 1, maximum: 200 },
    ordered: (current, next) =>
      next.day > current.day ||
      (next.day === current.day && next.at > current.at),
    each: entityValidator.EACH_DAY_AT_CONSTRAINT
  },
  additionalPerformances: ADDITIONAL_PERFORMANCES_CONSTRAINT,
  specialPerformances: {
    ...ADDITIONAL_PERFORMANCES_CONSTRAINT,
    each: {
      ...ADDITIONAL_PERFORMANCES_CONSTRAINT.each,
      audienceTags: AUDIENCE_TAGS_CONSTRAINT
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
        date: entityValidator.REQUIRED_DATE_CONSTRAINT,
        at: entityValidator.OPTIONAL_DATE_CONSTRAINT
      }
    }
  },
  talents: {
    array: true,
    length: { minimum: 1, maximum: 50 },
    each: {
      object: {
        id: entityValidator.REQUIRED_ID_CONSTRAINT,
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
  audienceTags: {
    array: true,
    length: { minimum: 1, maximum: 20 },
    each: entityValidator.EACH_TAG_CONSTRAINT(tagType.AUDIENCE)
  },
  geoTags: {
    array: true,
    length: { minimum: 1, maximum: 20 },
    each: entityValidator.EACH_TAG_CONSTRAINT(tagType.GEO)
  },
  mediumTags: {
    array: true,
    length: { minimum: 1, maximum: 20 },
    each: entityValidator.EACH_TAG_CONSTRAINT(tagType.MEDIUM)
  },
  styleTags: {
    array: true,
    length: { minimum: 1, maximum: 20 },
    each: entityValidator.EACH_TAG_CONSTRAINT(tagType.STYLE)
  },
  links: entityValidator.LINKS_CONSTRAINT,
  images: entityValidator.IMAGES_CONSTRAINT,
  reviews: {
    array: true,
    length: { maximum: 5 },
    each: {
      object: {
        source: entityValidator.REQUIRED_ADDITIONAL_INFO_CONSTRAINT,
        rating: RATING_CONSTRAINT
      }
    }
  },
  weSay: entityValidator.WE_SAY_CONSTRAINT,
  notes: entityValidator.NOTES_CONSTRAINT,
  soldOutPerformances: {
    array: true,
    length: { maximum: 1000 },
    each: {
      object: {
        date: entityValidator.REQUIRED_DATE_CONSTRAINT,
        at: entityValidator.REQUIRED_TIME_CONSTRAINT
      }
    },
    dependency: {
      test: value => value && value.length > 0,
      ensure: (__, attrs) => attrs.eventType === eventType.PERFORMANCE,
      message: "Can only have sold out performances if event is a performance"
    }
  },
  version: entityValidator.VERSION_CONSTRAINT,
  createdDate: entityValidator.OPTIONAL_DATE_CONSTRAINT,
  updatedDate: entityValidator.OPTIONAL_DATE_CONSTRAINT
};

function errorHandler(errors) {
  throw new Error("[400] Bad Request: " + errors.join("; "));
}

export function validateCreateOrUpdateEventRequest(request) {
  ensure(request, EVENT_CONSTRAINT, errorHandler);
}
