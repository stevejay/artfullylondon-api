import normalise from "../normalise";
import {
  STRING_NORMALISER,
  HTML_NORMALISER,
  BASIC_ARRAY_NORMALISER,
  LINKS_NORMALISER,
  IMAGES_NORMALISER
} from "../entity/normaliser";

const EVENT_NORMALISER = {
  name: STRING_NORMALISER,
  summary: STRING_NORMALISER,
  duration: STRING_NORMALISER,
  venueGuidance: STRING_NORMALISER,
  timesRanges: {
    ...BASIC_ARRAY_NORMALISER,
    each: {
      object: {
        dateFrom: STRING_NORMALISER,
        dateTo: STRING_NORMALISER,
        label: STRING_NORMALISER
      }
    }
  },
  openingTimes: BASIC_ARRAY_NORMALISER,
  additionalOpeningTimes: BASIC_ARRAY_NORMALISER,
  specialOpeningTimes: {
    ...BASIC_ARRAY_NORMALISER,
    each: {
      object: {
        audienceTags: BASIC_ARRAY_NORMALISER
      }
    }
  },
  openingTimesClosures: BASIC_ARRAY_NORMALISER,
  performances: BASIC_ARRAY_NORMALISER,
  additionalPerformances: BASIC_ARRAY_NORMALISER,
  specialPerformances: {
    ...BASIC_ARRAY_NORMALISER,
    each: {
      object: {
        audienceTags: BASIC_ARRAY_NORMALISER
      }
    }
  },
  performancesClosures: BASIC_ARRAY_NORMALISER,
  talents: {
    ...BASIC_ARRAY_NORMALISER,
    each: {
      object: {
        roles: {
          each: {
            collapseWhitespace: true,
            ...STRING_NORMALISER
          }
        },
        characters: {
          undefinedIfEmpty: true,
          each: {
            collapseWhitespace: true,
            ...STRING_NORMALISER
          }
        }
      }
    }
  },
  audienceTags: BASIC_ARRAY_NORMALISER,
  geoTags: BASIC_ARRAY_NORMALISER,
  mediumTags: BASIC_ARRAY_NORMALISER,
  styleTags: BASIC_ARRAY_NORMALISER,
  reviews: {
    ...BASIC_ARRAY_NORMALISER,
    each: {
      object: {
        source: {
          collapseWhitespace: true,
          ...STRING_NORMALISER
        }
      }
    }
  },
  soldOutPerformances: BASIC_ARRAY_NORMALISER,
  description: HTML_NORMALISER,
  descriptionCredit: STRING_NORMALISER,
  links: LINKS_NORMALISER,
  images: IMAGES_NORMALISER,
  weSay: STRING_NORMALISER,
  notes: STRING_NORMALISER
};

export function normaliseCreateOrUpdateEventRequest(request) {
  return normalise({ ...request }, EVENT_NORMALISER);
}
