import * as statusType from "../types/status-type";
import * as linkType from "../types/link-type";

const NAME_LENGTH = { minimum: 1, maximum: 200 };
const DESCRIPTION_LENGTH = { minimum: 1, maximum: 5000 };
const WE_SAY_LENGTH = { minimum: 1, maximum: 300 };
const URL_LENGTH = { minimum: 1, maximum: 200 };
const ADDITIONAL_INFO_LENGTH = { minimum: 1, maximum: 200 };
const IMAGES_LENGTH = { minimum: 1, maximum: 10 };
const LINKS_LENGTH = { minimum: 1, maximum: linkType.ALLOWED_VALUES.length };
const HEX_COLOR_REGEX = /^[a-f0-9]{6}$/;
const ISO_DATE_REGEX = /^[12]\d\d\d-[01]\d-[0123]\d$/;
const TIME_REGEX = /^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/;
const TIMES_ARRAY_LENGTH = { minimum: 1, maximum: 200 };

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

export const DESCRIPTION_CONSTRAINT = {
  string: true,
  length: DESCRIPTION_LENGTH
};

export const SUMMARY_CONSTRAINT =  {
  string: true,
  presence: true,
  length: { minimum: 1, maximum: 140 }
}

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
  length: { maximum: 400 };
}

export const VERSION_CONSTRAINT = {
  number: true,
  presence: true,
  numericality: { onlyInteger: true, greaterThanOrEqualTo: 1 }
};

export const OPTIONAL_DATE_CONSTRAINT = {
  format: ISO_DATE_REGEX
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
