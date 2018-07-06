import _ from "lodash";
import * as linkType from "../types/link-type";
import linkUrlValidator from "./link-url-validator";

const TIMES_ARRAY_LENGTH = { minimum: 1, maximum: 200 };

export const OPTIONAL_STRING = {
  string: true,
  length: { minimum: 1, maximum: 400 }
};

export const REQUIRED_STRING = {
  presence: true,
  ...OPTIONAL_STRING
};

export const OPTIONAL_LONG_STRING = {
  string: true,
  length: { minimum: 1, maximum: 5000 }
};

export const OPTIONAL_BOOL = {
  bool: true
};

export const REQUIRED_BOOL = {
  presence: true,
  ...OPTIONAL_BOOL
};

export const OPTIONAL_ENUM = allowedValues => ({
  string: true,
  inclusion: allowedValues
});

export const REQUIRED_ENUM = allowedValues => ({
  presence: true,
  string: true,
  inclusion: allowedValues
});

export const OPTIONAL_TIME = {
  string: true,
  format: /^(?:[01][0-9]|2[0-3]):[0-5][0-9]$/
};

export const REQUIRED_TIME = {
  presence: true,
  ...OPTIONAL_TIME
};

export const OPTIONAL_DATE = {
  string: true,
  format: /^[12]\d\d\d-[01]\d-[0123]\d$/
};

export const REQUIRED_DATE = {
  presence: true,
  ...OPTIONAL_DATE
};

export const REQUIRED_DAY_NUMBER = {
  presence: true,
  number: true,
  numericality: {
    onlyInteger: true,
    greaterThanOrEqualTo: 1,
    lessThanOrEqualTo: 7
  }
};

export const OPTIONAL_VERSION = {
  number: true,
  numericality: { onlyInteger: true, greaterThanOrEqualTo: 1 }
};

const OPENING_TIMES_ORDER = (current, next) =>
  next.day > current.day ||
  (next.day === current.day && next.from > current.to);

const OPENING_TIMES_WITH_DATE_RANGE_ORDER = (current, next) =>
  next.date > current.date ||
  (next.date === current.date && next.from > current.to);

const OPENING_TIMES_CLOSURES_ORDER = (current, next) =>
  next.date > current.date ||
  (next.date === current.date && next.from > current.to);

export const TO_OPENING_TIME_DEPENDENCY_ON_FROM_OPENING_TIME = {
  ensure: (value, attrs) => value > attrs.from,
  message: "To time is not greater than from time"
};

const OPTIONAL_TO_OPENING_TIME_DEPENDENCY_ON_FROM_OPENING_TIME = {
  ensure: (value, attrs) =>
    (_.isNil(attrs.from) && _.isNil(value)) || value > attrs.from,
  message: "To time is not greater than from time"
};

export const LINKS = {
  array: true,
  length: { minimum: 1, maximum: linkType.ALLOWED_VALUES.length },
  each: {
    object: {
      type: REQUIRED_ENUM(linkType.ALLOWED_VALUES),
      url: {
        url: true,
        presence: true,
        length: { minimum: 1, maximum: 200 },
        dependency: {
          ensure: (value, attrs) => linkUrlValidator(value, attrs.type),
          message: "Url is not valid for link type"
        }
      }
    }
  }
};

export const IMAGES = {
  array: true,
  length: { minimum: 1, maximum: 10 },
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
      copyright: OPTIONAL_STRING,
      dominantColor: {
        string: true,
        format: /^[a-f0-9]{6}$/
      }
    }
  }
};

export const OPENING_TIMES = {
  array: true,
  length: TIMES_ARRAY_LENGTH,
  ordered: OPENING_TIMES_ORDER,
  each: {
    object: {
      day: REQUIRED_DAY_NUMBER,
      from: REQUIRED_TIME,
      to: {
        ...REQUIRED_TIME,
        dependency: TO_OPENING_TIME_DEPENDENCY_ON_FROM_OPENING_TIME
      },
      timesRangeId: OPTIONAL_STRING
    }
  }
};

export const ADDITIONAL_OPENING_TIMES = {
  array: true,
  length: TIMES_ARRAY_LENGTH,
  ordered: OPENING_TIMES_WITH_DATE_RANGE_ORDER,
  each: {
    object: {
      date: REQUIRED_DATE,
      from: REQUIRED_TIME,
      to: {
        ...REQUIRED_TIME,
        dependency: TO_OPENING_TIME_DEPENDENCY_ON_FROM_OPENING_TIME
      }
    }
  }
};

export const OPENING_TIMES_CLOSURES = {
  array: true,
  length: TIMES_ARRAY_LENGTH,
  ordered: OPENING_TIMES_CLOSURES_ORDER,
  each: {
    object: {
      date: REQUIRED_DATE,
      from: OPTIONAL_TIME,
      to: {
        ...OPTIONAL_TIME,
        dependency: OPTIONAL_TO_OPENING_TIME_DEPENDENCY_ON_FROM_OPENING_TIME
      }
    }
  }
};
