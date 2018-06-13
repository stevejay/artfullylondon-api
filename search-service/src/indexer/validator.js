const DATE_REGEX = /^[12]\d\d\d-[01]\d-[0123]\d$/;
const TIME_REGEX = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
const DAY_NUMBER_NUMERICALITY = {
  onlyInteger: true,
  greaterThanOrEqualTo: 1,
  lessThanOrEqualTo: 7
};

const TAGS_ARRAY_CONSTRAINT = {
  array: true,
  each: {
    object: {
      id: {
        presence: true,
        string: true
      },
      label: {
        presence: true,
        string: true
      }
    }
  }
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
      format: TIME_REGEX
    },
    timesRangeId: {
      string: true
    }
  }
};

const EACH_DAY_AT_CONSTRAINT = {
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

const EACH_DATE_RANGE_CONSTRAINT = {
  object: {
    date: {
      presence: true,
      string: true,
      format: DATE_REGEX
    },
    from: {
      presence: true,
      string: true,
      format: TIME_REGEX
    },
    to: {
      presence: true,
      string: true,
      format: TIME_REGEX
    }
  }
};

const EACH_DATE_OPTIONAL_RANGE_CONSTRAINT = {
  object: {
    date: {
      presence: true,
      string: true,
      format: DATE_REGEX
    },
    from: {
      string: true,
      format: TIME_REGEX
    },
    to: {
      string: true,
      format: TIME_REGEX
    }
  }
};

const EACH_DATE_AT_CONSTRAINT = {
  object: {
    date: {
      presence: true,
      string: true,
      format: DATE_REGEX
    },
    at: {
      presence: true,
      string: true,
      format: TIME_REGEX
    }
  }
};

const EACH_DATE_OPTIONAL_AT_CONSTRAINT = {
  object: {
    date: {
      presence: true,
      string: true,
      format: DATE_REGEX
    },
    at: {
      string: true,
      format: TIME_REGEX
    }
  }
};

const ENTITY_BASIC_CONSTRAINT = {
  entityType: {
    string: true,
    presence: true
  },
  id: {
    string: true,
    presence: true
  },
  status: {
    string: true,
    presence: true
  },
  version: {
    number: true,
    presence: true
  },
  images: {
    array: true,
    each: {
      object: {
        id: {
          presence: true
        },
        ratio: {
          number: true,
          presence: true
        },
        copyright: {
          string: true
        },
        dominantColor: {
          string: true
        }
      }
    }
  }
};

const TALENT_CONSTRAINT = {
  ...ENTITY_BASIC_CONSTRAINT,
  talentType: {
    string: true,
    presence: true
  },
  firstNames: {
    string: true
  },
  lastName: {
    string: true,
    presence: true
  },
  commonRole: {
    string: true,
    presence: true
  }
};

const VENUE_CONSTRAINT = {
  ...ENTITY_BASIC_CONSTRAINT,
  name: {
    string: true,
    presence: true
  },
  address: {
    string: true,
    presence: true
  },
  postcode: {
    string: true,
    presence: true
  },
  latitude: {
    number: true,
    presence: true
  },
  longitude: {
    number: true,
    presence: true
  },
  venueType: {
    string: true,
    presence: true
  }
};

const EVENT_SERIES_CONSTRAINT = {
  ...ENTITY_BASIC_CONSTRAINT,
  name: {
    string: true,
    presence: true
  },
  eventSeriesType: {
    string: true,
    presence: true
  },
  occurrence: {
    string: true,
    presence: true
  },
  summary: {
    string: true,
    presence: true
  }
};

const EVENT_CONSTRAINT = {
  ...ENTITY_BASIC_CONSTRAINT,
  name: {
    string: true,
    presence: true
  },
  summary: {
    string: true,
    presence: true
  },
  eventType: {
    string: true,
    presence: true
  },
  occurrenceType: {
    string: true,
    presence: true
  },
  costType: {
    string: true,
    presence: true
  },
  bookingType: {
    string: true,
    presence: true
  },
  soldOut: {
    bool: true
  },
  dateFrom: {
    string: true,
    format: DATE_REGEX
  },
  dateTo: {
    string: true,
    format: DATE_REGEX
  },
  rating: {
    number: true,
    presence: true
  },
  minAge: {
    number: true
  },
  maxAge: {
    number: true
  },
  costFrom: {
    number: true
  },
  venue: {
    object: {
      id: {
        string: true,
        presence: true
      },
      name: {
        string: true,
        presence: true
      },
      postcode: {
        string: true,
        presence: true
      },
      latitude: {
        number: true,
        presence: true
      },
      longitude: {
        number: true,
        presence: true
      },
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
        each: {
          string: true
        }
      }
    },
    presence: true
  },
  eventSeries: {
    object: {
      id: {
        string: true,
        presence: true
      }
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
        string: true,
        presence: true
      }
    }
  },
  links: {
    array: true,
    each: {
      object: {
        url: {
          string: true,
          presence: true
        }
      }
    }
  },
  useVenueOpeningTimes: {
    bool: true,
    presence: true
  },
  timesRanges: {
    array: true,
    each: {
      object: {
        id: {
          presence: true,
          string: true
        },
        dateFrom: {
          presence: true,
          format: DATE_REGEX
        },
        dateTo: {
          presence: true,
          format: DATE_REGEX
        },
        label: {
          presence: true,
          string: true
        }
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
        date: {
          string: true,
          presence: true,
          format: DATE_REGEX
        },
        at: {
          string: true,
          presence: true,
          format: TIME_REGEX
        }
      }
    }
  }
};
