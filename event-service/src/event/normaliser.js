import normalise from "normalise-request";
import * as entityNormaliser from "../entity/normaliser";

const EVENT_NORMALISER = {
  name: {
    trim: true
  },
  summary: {
    trim: true
  },
  duration: {
    trim: true,
    undefinedIfEmpty: true
  },
  venueGuidance: {
    trim: true,
    undefinedIfEmpty: true
  },
  timesRanges: {
    undefinedIfEmpty: true,
    each: {
      object: {
        dateFrom: {
          trim: true,
          undefinedIfEmpty: true
        },
        dateTo: {
          trim: true,
          undefinedIfEmpty: true
        },
        label: {
          trim: true,
          undefinedIfEmpty: true
        }
      }
    }
  },
  openingTimes: {
    undefinedIfEmpty: true
  },
  additionalOpeningTimes: {
    undefinedIfEmpty: true
  },
  specialOpeningTimes: {
    undefinedIfEmpty: true,
    each: {
      object: {
        audienceTags: {
          undefinedIfEmpty: true
        }
      }
    }
  },
  openingTimesClosures: {
    undefinedIfEmpty: true
  },
  performances: {
    undefinedIfEmpty: true
  },
  additionalPerformances: {
    undefinedIfEmpty: true
  },
  specialPerformances: {
    undefinedIfEmpty: true,
    each: {
      object: {
        audienceTags: {
          undefinedIfEmpty: true
        }
      }
    }
  },
  performancesClosures: {
    undefinedIfEmpty: true
  },
  talents: {
    undefinedIfEmpty: true,
    each: {
      object: {
        roles: {
          each: {
            collapseWhitespace: true,
            trim: true
          }
        },
        characters: {
          undefinedIfEmpty: true,
          each: {
            collapseWhitespace: true,
            trim: true
          }
        }
      }
    }
  },
  audienceTags: {
    undefinedIfEmpty: true
  },
  geoTags: {
    undefinedIfEmpty: true
  },
  mediumTags: {
    undefinedIfEmpty: true
  },
  styleTags: {
    undefinedIfEmpty: true
  },
  reviews: {
    undefinedIfEmpty: true,
    each: {
      object: {
        source: {
          collapseWhitespace: true,
          trim: true
        }
      }
    }
  },
  soldOutPerformances: {
    undefinedIfEmpty: true
  },
  description: entityNormaliser.DESCRIPTION_NORMALISER,
  descriptionCredit: entityNormaliser.DESCRIPTION_CREDIT_NORMALISER,
  links: entityNormaliser.LINKS_NORMALISER,
  images: entityNormaliser.IMAGES_NORMALISER,
  weSay: entityNormaliser.WE_SAY_NORMALISER
};

export function normaliseCreateOrUpdateEventRequest(request) {
  return normalise({ ...request }, EVENT_NORMALISER);
}
