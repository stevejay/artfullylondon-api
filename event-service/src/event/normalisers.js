"use strict";

const normalisers = require("../data/normalisers");

module.exports = exports = {
  name: {
    trim: true
  },
  summary: {
    trim: true
  },
  description: {
    trim: true,
    undefinedIfEmpty: true
  },
  descriptionCredit: {
    trim: true,
    undefinedIfEmpty: true
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
  links: normalisers.linksNormaliser,
  images: normalisers.imagesNormaliser,
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
  weSay: {
    trim: true,
    undefinedIfEmpty: true
  },
  soldOutPerformances: {
    undefinedIfEmpty: true
  }
};
