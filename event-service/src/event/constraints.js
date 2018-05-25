"use strict";

const isNil = require("lodash.isnil");
const includes = require("lodash.includes");
const every = require("lodash.every");
const find = require("lodash.find");
const constants = require("./constants");
const globalConstants = require("../constants");
const globalConstraints = require("../data/constraints");

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
  eventType: {
    presence: true,
    inclusion: constants.ALLOWED_EVENT_TYPES,
    dependency: [
      {
        test: value => value === constants.EVENT_TYPE_PERFORMANCE,
        ensure: (_, attrs) =>
          includes(
            constants.ALLOWED_PERFORMANCE_OCCURRENCE_TYPES,
            attrs.occurrenceType
          ),
        message: "Occurrence type is not valid for performance event"
      },
      {
        test: value => value === constants.EVENT_TYPE_COURSE,
        ensure: (_, attrs) =>
          includes(
            constants.ALLOWED_COURSE_OCCURRENCE_TYPES,
            attrs.occurrenceType
          ),
        message: "Occurrence type is not valid for course event"
      },
      {
        test: value => value === constants.EVENT_TYPE_EXHIBITION,
        ensure: (_, attrs) =>
          includes(
            constants.ALLOWED_EXHIBITION_OCCURRENCE_TYPES,
            attrs.occurrenceType
          ),
        message: "Occurrence type is not valid for exhibition event"
      }
    ]
  },
  occurrenceType: {
    presence: true,
    inclusion: constants.ALLOWED_PERFORMANCE_OCCURRENCE_TYPES,
    dependency: [
      {
        test: value => value === constants.OCCURRENCE_TYPE_ONETIME,
        ensure: (_, attrs) => attrs.dateFrom && attrs.dateFrom === attrs.dateTo,
        message: "Date from must equal date to and both must be given"
      },
      {
        test: value => value === constants.OCCURRENCE_TYPE_BOUNDED,
        ensure: (_, attrs) => attrs.dateFrom && attrs.dateTo >= attrs.dateFrom,
        message:
          "Date to must be greater than or equal to date from and both must be given"
      },
      {
        test: value => value === constants.OCCURRENCE_TYPE_CONTINUOUS,
        ensure: (_, attrs) => isNil(attrs.dateFrom) && isNil(attrs.dateTo),
        message: "Date from and date to must be null"
      }
    ]
  },
  dateFrom: {
    string: true,
    format: globalConstraints.DATE_REGEX
  },
  dateTo: {
    string: true,
    format: globalConstraints.DATE_REGEX
  },
  soldOut: {
    bool: true
  },
  summary: {
    string: true,
    presence: true,
    length: globalConstraints.SUMMARY_LENGTH
  },
  description: {
    string: true,
    length: globalConstraints.DESCRIPTION_LENGTH
  },
  descriptionCredit: {
    string: true,
    length: globalConstraints.ADDITIONAL_INFO_LENGTH
  },
  rating: {
    number: true,
    presence: true,
    numericality: globalConstraints.RATING_NUMERICALITY
  },
  minAge: {
    number: true,
    numericality: globalConstraints.AGE_NUMERICALITY
  },
  maxAge: {
    number: true,
    numericality: globalConstraints.AGE_NUMERICALITY,
    dependency: {
      test: (value, attrs) => !isNil(value) && !isNil(attrs.minAge),
      ensure: (value, attrs) => value >= attrs.minAge,
      message: "Max age must be greater than or equal to Min age"
    }
  },
  costType: {
    presence: true,
    inclusion: constants.ALLOWED_COST_TYPES,
    dependency: [
      {
        test: value => value === constants.COST_TYPE_FREE,
        ensure: (_, attrs) => isNil(attrs.costFrom) && isNil(attrs.costTo),
        message: "Cost from and cost to must be null"
      },
      {
        test: value => value === constants.COST_TYPE_PAID,
        ensure: (_, attrs) =>
          attrs.costFrom >= 0 && attrs.costTo >= attrs.costFrom,
        message:
          "Cost to must be greater than or equal to cost from and both must be given"
      }
    ]
  },
  costFrom: {
    number: true,
    numericality: globalConstraints.COST_NUMERICALITY
  },
  costTo: {
    number: true,
    numericality: globalConstraints.COST_NUMERICALITY
  },
  bookingType: {
    presence: true,
    inclusion: constants.ALLOWED_BOOKING_TYPES,
    dependency: {
      test: value => value === constants.BOOKING_TYPE_NOT_REQUIRED,
      ensure: (_, attrs) => isNil(attrs.bookingOpens),
      message: "Booking opens must be null"
    }
  },
  bookingOpens: {
    string: true,
    format: globalConstraints.DATE_REGEX
  },
  timedEntry: {
    bool: true,
    dependency: {
      test: value => !!value,
      ensure: (_, attrs) => attrs.eventType === constants.EVENT_TYPE_EXHIBITION,
      message: "Only exhibition events can have the timed entry flag set"
    }
  },
  duration: {
    string: true,
    format: globalConstraints.TIME_REGEX
  },
  eventSeriesId: {
    string: true,
    length: globalConstraints.ID_LENGTH
  },
  venueId: {
    string: true,
    presence: true,
    length: globalConstraints.ID_LENGTH
  },
  venueGuidance: {
    string: true,
    length: globalConstraints.ADDITIONAL_INFO_LENGTH
  },
  useVenueOpeningTimes: {
    bool: true,
    presence: true,
    dependency: {
      test: value => value === true,
      ensure: (_, attrs) => attrs.eventType === constants.EVENT_TYPE_EXHIBITION,
      message:
        "Cannot use venue opening times if event is a performance or a course"
    }
  },
  timesRanges: {
    array: true,
    length: globalConstraints.TIMES_ARRAY_LENGTH,
    ordered: globalConstraints.TIMES_RANGES_ORDER,
    each: {
      object: {
        id: {
          presence: true,
          string: true
        },
        dateFrom: {
          presence: true,
          format: exports.DATE_REGEX
        },
        dateTo: {
          presence: true,
          format: exports.DATE_REGEX,
          dependency: {
            ensure: (value, attrs) => value > attrs.dateFrom,
            message:
              "For each times range, Date To must be greater than Date From"
          }
        },
        label: {
          presence: true,
          string: true
        }
      }
    },
    dependency: [
      {
        test: value => value && value.length > 0,
        ensure: (_, attrs) =>
          attrs.occurrenceType === constants.OCCURRENCE_TYPE_BOUNDED,
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
          (attrs.eventType === constants.EVENT_TYPE_EXHIBITION &&
            (attrs.useVenueOpeningTimes ||
              every(attrs.openingTimes, x =>
                find(value, y => y.id === x.timesRangeId)
              ))) ||
          (attrs.eventType === constants.EVENT_TYPE_PERFORMANCE &&
            every(attrs.performances, x =>
              find(value, y => y.id === x.timesRangeId)
            )),
        message:
          "All Opening Times / Performances must have a recognized Times Range Id"
      }
    ]
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
  specialOpeningTimes: {
    array: true,
    length: globalConstraints.TIMES_ARRAY_LENGTH,
    ordered: globalConstraints.OPENING_TIMES_WITH_DATE_RANGE_ORDER,
    each: Object.assign({}, globalConstraints.EACH_DATE_RANGE_CONSTRAINT, {
      audienceTags: {
        each: globalConstraints.EACH_TAG_CONSTRAINT(
          globalConstants.TAG_TYPE_AUDIENCE
        )
      }
    })
  },
  openingTimesClosures: {
    array: true,
    length: globalConstraints.TIMES_ARRAY_LENGTH,
    ordered: globalConstraints.OPENING_TIMES_CLOSURES_ORDER,
    each: globalConstraints.EACH_DATE_OPTIONAL_RANGE_CONSTRAINT
  },
  performances: {
    array: true,
    length: globalConstraints.TIMES_ARRAY_LENGTH,
    ordered: globalConstraints.PERFORMANCES_ORDER,
    each: globalConstraints.EACH_DAY_AT_CONSTRAINT
  },
  additionalPerformances: {
    array: true,
    length: globalConstraints.TIMES_ARRAY_LENGTH,
    ordered: globalConstraints.PERFORMANCES_WITH_DATE_AT_ORDER,
    each: globalConstraints.EACH_DATE_AT_CONSTRAINT
  },
  specialPerformances: {
    array: true,
    length: globalConstraints.TIMES_ARRAY_LENGTH,
    ordered: globalConstraints.PERFORMANCES_WITH_DATE_AT_ORDER,
    each: Object.assign({}, globalConstraints.EACH_DATE_AT_CONSTRAINT, {
      audienceTags: {
        each: globalConstraints.EACH_TAG_CONSTRAINT(
          globalConstants.TAG_TYPE_AUDIENCE
        )
      }
    })
  },
  performancesClosures: {
    array: true,
    length: globalConstraints.TIMES_ARRAY_LENGTH,
    ordered: globalConstraints.PERFORMANCES_CLOSURES_ORDER,
    each: globalConstraints.EACH_DATE_OPTIONAL_AT_CONSTRAINT
  },
  talents: {
    array: true,
    length: globalConstraints.TALENT_LENGTH,
    each: {
      object: {
        id: {
          string: true,
          presence: true,
          length: globalConstraints.ID_LENGTH
        },
        roles: {
          array: true,
          presence: true,
          length: globalConstraints.TALENT_ROLES_LENGTH,
          each: {
            string: true,
            presence: true,
            format: globalConstraints.TALENT_ROLE_REGEX,
            length: globalConstraints.TALENT_ROLE_LENGTH
          }
        },
        characters: {
          array: true,
          length: globalConstraints.TALENT_CHARACTERS_LENGTH,
          each: {
            string: true,
            presence: true,
            format: globalConstraints.TALENT_CHARACTER_REGEX,
            length: globalConstraints.TALENT_CHARACTER_LENGTH
          }
        }
      }
    }
  },
  audienceTags: {
    array: true,
    length: globalConstraints.TAGS_LENGTH,
    each: globalConstraints.EACH_TAG_CONSTRAINT(
      globalConstants.TAG_TYPE_AUDIENCE
    )
  },
  geoTags: {
    array: true,
    length: globalConstraints.TAGS_LENGTH,
    each: globalConstraints.EACH_TAG_CONSTRAINT(globalConstants.TAG_TYPE_GEO)
  },
  mediumTags: {
    array: true,
    length: globalConstraints.TAGS_LENGTH,
    each: globalConstraints.EACH_TAG_CONSTRAINT(globalConstants.TAG_TYPE_MEDIUM)
  },
  styleTags: {
    array: true,
    length: globalConstraints.TAGS_LENGTH,
    each: globalConstraints.EACH_TAG_CONSTRAINT(globalConstants.TAG_TYPE_STYLE)
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
  reviews: {
    array: true,
    length: globalConstraints.REVIEWS_ARRAY_LENGTH,
    each: {
      object: {
        source: {
          string: true,
          presence: true,
          length: globalConstraints.ADDITIONAL_INFO_LENGTH
        },
        rating: {
          number: true,
          presence: true,
          numericality: globalConstraints.RATING_NUMERICALITY
        }
      }
    }
  },
  weSay: {
    string: true,
    length: globalConstraints.WE_SAY_LENGTH
  },
  soldOutPerformances: {
    array: true,
    length: globalConstraints.SOLD_OUT_PERFORMANCES_ARRAY_LENGTH,
    each: {
      object: {
        date: {
          string: true,
          presence: true,
          format: globalConstraints.DATE_REGEX
        },
        at: {
          string: true,
          presence: true,
          format: globalConstraints.TIME_REGEX
        }
      }
    },
    dependency: {
      test: value => value && value.length > 0,
      ensure: (_, attrs) =>
        attrs.eventType === constants.EVENT_TYPE_PERFORMANCE,
      message: "Can only have sold out performances if event is a performance"
    }
  },
  version: {
    number: true,
    presence: true,
    numericality: globalConstraints.VERSION_NUMERICALITY
  },
  createdDate: {
    format: globalConstraints.DATE_REGEX
  },
  updatedDate: {
    format: globalConstraints.DATE_REGEX
  }
};
