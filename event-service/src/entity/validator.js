import _ from "lodash";
import * as statusType from "../types/status-type";
import * as linkType from "../types/link-type";
import * as tagType from "../types/tag-type";

const NAME_LENGTH = { minimum: 1, maximum: 200 };
const DESCRIPTION_LENGTH = { minimum: 1, maximum: 5000 };
const WE_SAY_LENGTH = { minimum: 1, maximum: 300 };
const URL_LENGTH = { minimum: 1, maximum: 200 };
const ADDITIONAL_INFO_LENGTH = { minimum: 1, maximum: 200 };
const IMAGES_LENGTH = { minimum: 1, maximum: 10 };
const ID_LENGTH = { minimum: 1, maximum: 300 };
const LINKS_LENGTH = { minimum: 1, maximum: linkType.ALLOWED_VALUES.length };
const HEX_COLOR_REGEX = /^[a-f0-9]{6}$/;
const ISO_DATE_REGEX = /^[12]\d\d\d-[01]\d-[0123]\d$/;
const TIME_REGEX = /^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/;
const TIMES_ARRAY_LENGTH = { minimum: 1, maximum: 200 };
const AUDIENCE_TAG_ID_REGEX = /^audience\//;
const GEO_TAG_ID_REGEX = /^geo\//;
const MEDIUM_TAG_ID_REGEX = /^medium\//;
const STYLE_TAG_ID_REGEX = /^style\//;

const OPENING_TIMES_ORDER = (current, next) =>
  next.day > current.day ||
  (next.day === current.day && next.from > current.to);

const OPENING_TIMES_WITH_DATE_RANGE_ORDER = (current, next) =>
  next.date > current.date ||
  (next.date === current.date && next.from > current.to);

const OPENING_TIMES_CLOSURES_ORDER = (current, next) =>
  next.date > current.date ||
  (next.date === current.date && next.from > current.to);

const DAY_NUMBER_NUMERICALITY = {
  onlyInteger: true,
  greaterThanOrEqualTo: 1,
  lessThanOrEqualTo: 7
};

const TO_OPENING_TIME_DEPENDENCY_ON_FROM_OPENING_TIME = {
  ensure: (value, attrs) => value > attrs.from,
  message: "To time is not greater than from time"
};

const OPTIONAL_TO_OPENING_TIME_DEPENDENCY_ON_FROM_OPENING_TIME = {
  ensure: (value, attrs) =>
    (_.isNil(attrs.from) && _.isNil(value)) || value > attrs.from,
  message: "To time is not greater than from time"
};

const EACH_DAY_RANGE_CONSTRAINT = {
  object: {
    day: {
      presence: true,
      number: true,
      numericality: DAY_NUMBER_NUMERICALITY
    },
    from: {
      presence: true,
      string: true,
      format: TIME_REGEX
    },
    to: {
      presence: true,
      string: true,
      format: TIME_REGEX,
      dependency: TO_OPENING_TIME_DEPENDENCY_ON_FROM_OPENING_TIME
    },
    timesRangeId: {
      string: true
    }
  }
};

export const EACH_DAY_AT_CONSTRAINT = {
  object: {
    day: {
      presence: true,
      number: true,
      numericality: DAY_NUMBER_NUMERICALITY
    },
    at: {
      presence: true,
      string: true,
      format: TIME_REGEX
    },
    timesRangeId: {
      string: true
    }
  }
};

export const EACH_DATE_AT_CONSTRAINT = {
  object: {
    date: {
      presence: true,
      string: true,
      format: ISO_DATE_REGEX
    },
    at: {
      presence: true,
      string: true,
      format: TIME_REGEX
    }
  }
};

const EACH_DATE_RANGE_CONSTRAINT = {
  object: {
    date: {
      presence: true,
      string: true,
      format: ISO_DATE_REGEX
    },
    from: {
      presence: true,
      string: true,
      format: TIME_REGEX
    },
    to: {
      presence: true,
      string: true,
      format: TIME_REGEX,
      dependency: TO_OPENING_TIME_DEPENDENCY_ON_FROM_OPENING_TIME
    }
  }
};

const EACH_DATE_OPTIONAL_RANGE_CONSTRAINT = {
  object: {
    date: {
      presence: true,
      string: true,
      format: ISO_DATE_REGEX
    },
    from: {
      string: true,
      format: TIME_REGEX
    },
    to: {
      string: true,
      format: TIME_REGEX,
      dependency: OPTIONAL_TO_OPENING_TIME_DEPENDENCY_ON_FROM_OPENING_TIME
    }
  }
};

export const STATUS_VALIDATOR = {
  presence: true,
  inclusion: statusType.ALLOWED_VALUES
};

export const OPTIONAL_NAME_CONSTRAINT = {
  string: true,
  length: NAME_LENGTH
};

export const REQUIRED_NAME_CONSTRAINT = {
  ...OPTIONAL_NAME_CONSTRAINT,
  presence: true
};

export const OPTIONAL_ID_CONSTRAINT = {
  string: true,
  length: ID_LENGTH
};

export const REQUIRED_ID_CONSTRAINT = {
  ...OPTIONAL_ID_CONSTRAINT,
  presence: true
};

export const DESCRIPTION_CONSTRAINT = {
  string: true,
  length: DESCRIPTION_LENGTH
};

export const SUMMARY_CONSTRAINT = {
  string: true,
  presence: true,
  length: { minimum: 1, maximum: 140 }
};

export const OPTIONAL_ADDITIONAL_INFO_CONSTRAINT = {
  string: true,
  length: ADDITIONAL_INFO_LENGTH
};

export const REQUIRED_ADDITIONAL_INFO_CONSTRAINT = {
  ...OPTIONAL_ADDITIONAL_INFO_CONSTRAINT,
  presence: true
};

export const WE_SAY_CONSTRAINT = {
  string: true,
  length: WE_SAY_LENGTH
};

export const NOTES_CONSTRAINT = {
  string: true,
  length: { maximum: 400 }
};

export const VERSION_CONSTRAINT = {
  number: true,
  presence: true,
  numericality: { onlyInteger: true, greaterThanOrEqualTo: 1 }
};

export const OPTIONAL_DATE_CONSTRAINT = {
  format: ISO_DATE_REGEX
};

export const REQUIRED_DATE_CONSTRAINT = {
  ...OPTIONAL_DATE_CONSTRAINT,
  presence: true
};

export const OPTIONAL_TIME_CONSTRAINT = {
  string: true,
  format: TIME_REGEX
};

export const REQUIRED_TIME_CONSTRAINT = {
  ...OPTIONAL_TIME_CONSTRAINT,
  presence: true
};

export const LINKS_CONSTRAINT = {
  array: true,
  length: LINKS_LENGTH,
  each: {
    object: {
      type: {
        string: true,
        presence: true,
        inclusion: linkType.ALLOWED_VALUES
      },
      url: {
        url: true,
        presence: true,
        length: URL_LENGTH,
        dependency: {
          ensure: (value, attrs) => isValidUrlForLinkType(value, attrs.type),
          message: "Url is not valid for link type"
        }
      }
    }
  }
};

export const IMAGES_CONSTRAINT = {
  array: true,
  length: IMAGES_LENGTH,
  each: {
    object: {
      id: {
        uuid: true,
        presence: true
      },
      ratio: {
        number: true,
        presence: true,
        numericality: { greaterThan: 0 }
      },
      copyright: {
        string: true,
        length: ADDITIONAL_INFO_LENGTH
      },
      dominantColor: {
        string: true,
        format: HEX_COLOR_REGEX
      }
    }
  }
};

export const OPENING_TIMES_CONSTRAINT = {
  array: true,
  length: TIMES_ARRAY_LENGTH,
  ordered: OPENING_TIMES_ORDER,
  each: EACH_DAY_RANGE_CONSTRAINT
};

export const ADDITIONAL_OPENING_TIMES_CONSTRAINT = {
  array: true,
  length: TIMES_ARRAY_LENGTH,
  ordered: OPENING_TIMES_WITH_DATE_RANGE_ORDER,
  each: EACH_DATE_RANGE_CONSTRAINT
};

export const OPENING_TIMES_CLOSURES_CONSTRAINT = {
  array: true,
  length: TIMES_ARRAY_LENGTH,
  ordered: OPENING_TIMES_CLOSURES_ORDER,
  each: EACH_DATE_OPTIONAL_RANGE_CONSTRAINT
};

export const EACH_TAG_CONSTRAINT = tagType => ({
  object: {
    id: {
      string: true,
      presence: true,
      format: getTagFormatConstraint(tagType),
      length: ID_LENGTH
    },
    label: {
      string: true,
      presence: true,
      format: /^\w[\w -]+\w$/,
      length: { minimum: 1, maximum: 50 }
    }
  }
});

function getTagFormatConstraint(tag) {
  switch (tag) {
    case tagType.STYLE:
      return STYLE_TAG_ID_REGEX;
    case tagType.MEDIUM:
      return MEDIUM_TAG_ID_REGEX;
    case tagType.AUDIENCE:
      return AUDIENCE_TAG_ID_REGEX;
    case tagType.GEO:
      return GEO_TAG_ID_REGEX;
    default:
      throw new Error(`tag type not found: ${tag}`);
  }
}

function isValidUrlForLinkType(url, linkType) {
  switch (linkType) {
    case linkType.WIKIPEDIA:
      return url.startsWith("https://en.wikipedia.org/") && noQueryString(url);
    case linkType.FACEBOOK:
      return url.startsWith("https://www.facebook.com/") && noQueryString(url);
    case linkType.TWITTER:
      return url.startsWith("https://twitter.com/") && noQueryString(url);
    case linkType.INSTAGRAM:
      return url.startsWith("https://www.instagram.com/") && noQueryString(url);
    default:
      return true;
  }
}

function noQueryString(url) {
  return url.indexOf("?") === -1;
}
