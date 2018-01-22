'use strict';

exports.REFRESH_SEARCH_INDEX_MAX_TAKE_PER_SCAN = 30;

exports.TAG_TYPE_AUDIENCE = 'audience';
exports.TAG_TYPE_MEDIUM = 'medium';
exports.TAG_TYPE_STYLE = 'style';
exports.TAG_TYPE_GEO = 'geo';

exports.ENTITY_TYPE_TALENT = 'talent';
exports.ENTITY_TYPE_VENUE = 'venue';
exports.ENTITY_TYPE_EVENT = 'event';
exports.ENTITY_TYPE_EVENT_SERIES = 'event-series';

exports.DATE_FORMAT = 'YYYY/MM/DD';
exports.STATUS_TYPE_PENDING = 'Pending';
exports.STATUS_TYPE_ACTIVE = 'Active';
exports.STATUS_TYPE_DELETED = 'Deleted';
exports.STATUS_TYPE_MERGED = 'Merged';

exports.ALLOWED_STATUS_TYPES = [
  exports.STATUS_TYPE_PENDING,
  exports.STATUS_TYPE_ACTIVE,
  exports.STATUS_TYPE_DELETED,
  exports.STATUS_TYPE_MERGED
];

exports.LINK_TYPE_WIKIPEDIA = 'Wikipedia';
exports.LINK_TYPE_FACEBOOK = 'Facebook';
exports.LINK_TYPE_TWITTER = 'Twitter';
exports.LINK_TYPE_HOMEPAGE = 'Homepage';
exports.LINK_TYPE_ACCESS = 'Access';
exports.LINK_TYPE_INSTAGRAM = 'Instagram';
exports.LINK_TYPE_BOOKING = 'Booking';

exports.ALLOWED_LINK_TYPES = [
  exports.LINK_TYPE_WIKIPEDIA,
  exports.LINK_TYPE_FACEBOOK,
  exports.LINK_TYPE_TWITTER,
  exports.LINK_TYPE_HOMEPAGE,
  exports.LINK_TYPE_ACCESS,
  exports.LINK_TYPE_INSTAGRAM,
  exports.LINK_TYPE_BOOKING
];

exports.NAMED_CLOSURE_TYPE_BANK_HOLIDAYS = 'BankHolidays';
exports.NAMED_CLOSURE_TYPE_BANK_HOLIDAY_WEEKENDS = 'BankHolidayWeekends';
exports.NAMED_CLOSURE_TYPE_CHRISTMAS_EVE = 'ChristmasEve';
exports.NAMED_CLOSURE_TYPE_CHRISTMAS_DAY = 'ChristmasDay';
exports.NAMED_CLOSURE_TYPE_BOXING_DAY = 'BoxingDay';
exports.NAMED_CLOSURE_TYPE_NEW_YEARS_EVE = 'NewYearsEve';
exports.NAMED_CLOSURE_TYPE_NEW_YEARS_DAY = 'NewYearsDay';
exports.NAMED_CLOSURE_TYPE_CHRISTMAS_PERIOD = 'ChristmasPeriod';
exports.NAMED_CLOSURE_TYPE_EASTER_SUNDAY = 'EasterSunday';
exports.NAMED_CLOSURE_TYPE_EASTER_HOLIDAY_PERIOD = 'EasterHolidayPeriod';
exports.NAMED_CLOSURE_TYPE_AUGUST_SATURDAYS = 'AugustSaturdays';
exports.NAMED_CLOSURE_TYPE_ROSH_HASHANAH = 'RoshHashanah';
exports.NAMED_CLOSURE_TYPE_YOM_KIPPUR = 'YomKippur';
exports.NAMED_CLOSURE_TYPE_AUGUST = 'August';

exports.ALLOWED_NAMED_CLOSURE_TYPES = [
  exports.NAMED_CLOSURE_TYPE_BANK_HOLIDAYS,
  exports.NAMED_CLOSURE_TYPE_BANK_HOLIDAY_WEEKENDS,
  exports.NAMED_CLOSURE_TYPE_CHRISTMAS_EVE,
  exports.NAMED_CLOSURE_TYPE_CHRISTMAS_DAY,
  exports.NAMED_CLOSURE_TYPE_BOXING_DAY,
  exports.NAMED_CLOSURE_TYPE_NEW_YEARS_EVE,
  exports.NAMED_CLOSURE_TYPE_NEW_YEARS_DAY,
  exports.NAMED_CLOSURE_TYPE_CHRISTMAS_PERIOD,
  exports.NAMED_CLOSURE_TYPE_EASTER_SUNDAY,
  exports.NAMED_CLOSURE_TYPE_EASTER_HOLIDAY_PERIOD,
  exports.NAMED_CLOSURE_TYPE_AUGUST_SATURDAYS,
  exports.NAMED_CLOSURE_TYPE_ROSH_HASHANAH,
  exports.NAMED_CLOSURE_TYPE_YOM_KIPPUR,
  exports.NAMED_CLOSURE_TYPE_AUGUST
];

exports.NAMED_CLOSURE_DATES_LOOKUP = {
  [exports.NAMED_CLOSURE_TYPE_AUGUST_SATURDAYS]: {
    '2017': ['2017/08/05', '2017/08/12', '2017/08/19', '2017/08/26'],
    '2018': ['2017/08/04', '2017/08/11', '2017/08/18', '2017/08/25']
  },
  [exports.NAMED_CLOSURE_TYPE_EASTER_SUNDAY]: {
    '2017': ['2017/04/16'],
    '2018': ['2018/04/01']
  },
  [exports.NAMED_CLOSURE_TYPE_EASTER_HOLIDAY_PERIOD]: {
    '2017': ['2017/04/14', '2017/04/15', '2017/04/16', '2017/04/17'],
    '2018': ['2018/03/30', '2018/03/31', '2018/04/01', '2018/04/02']
  },
  [exports.NAMED_CLOSURE_TYPE_CHRISTMAS_EVE]: {
    '2016': ['2016/12/24'],
    '2017': ['2017/12/24'],
    '2018': ['2018/12/24']
  },
  [exports.NAMED_CLOSURE_TYPE_CHRISTMAS_DAY]: {
    '2016': ['2016/12/25'],
    '2017': ['2017/12/25'],
    '2018': ['2018/12/25']
  },
  [exports.NAMED_CLOSURE_TYPE_BOXING_DAY]: {
    '2016': ['2016/12/26'],
    '2017': ['2017/12/26'],
    '2018': ['2018/12/26']
  },
  [exports.NAMED_CLOSURE_TYPE_BOXING_DAY]: {
    '2016': ['2016/12/26'],
    '2017': ['2017/12/26'],
    '2018': ['2018/12/26']
  },
  [exports.NAMED_CLOSURE_TYPE_NEW_YEARS_EVE]: {
    '2016': ['2016/12/31'],
    '2017': ['2017/12/31'],
    '2018': ['2018/12/31']
  },
  [exports.NAMED_CLOSURE_TYPE_NEW_YEARS_DAY]: {
    '2017': ['2017/01/01'],
    '2018': ['2018/01/01']
  },
  [exports.NAMED_CLOSURE_TYPE_CHRISTMAS_PERIOD]: {
    '2016': [
      '2016/12/24',
      '2016/12/25',
      '2016/12/26',
      '2016/12/27',
      '2016/12/28',
      '2016/12/29',
      '2016/12/30',
      '2016/12/31',
      '2017/01/01',
      '2017/01/02'
    ],
    '2017': [
      '2017/12/24',
      '2017/12/25',
      '2017/12/26',
      '2017/12/27',
      '2017/12/28',
      '2017/12/29',
      '2017/12/30',
      '2017/12/31',
      '2018/01/01'
    ],
    '2018': [
      '2018/12/24',
      '2018/12/25',
      '2018/12/26',
      '2018/12/27',
      '2018/12/28',
      '2018/12/29',
      '2018/12/30',
      '2018/12/31',
      '2019/01/01'
    ]
  },
  [exports.NAMED_CLOSURE_TYPE_BANK_HOLIDAYS]: {
    '2016': ['2016/12/25', '2016/12/26', '2016/12/27'],
    '2017': [
      '2017/01/01',
      '2017/01/02',
      '2017/04/14',
      '2017/04/17',
      '2017/05/01',
      '2017/05/29',
      '2017/08/28',
      '2017/12/25',
      '2017/12/26'
    ],
    '2018': [
      '2018/01/01',
      '2018/03/30',
      '2018/04/02',
      '2018/05/07',
      '2018/05/28',
      '2018/08/27',
      '2018/12/25',
      '2018/12/26'
    ]
  },
  [exports.NAMED_CLOSURE_TYPE_BANK_HOLIDAY_WEEKENDS]: {
    '2016': ['2016/12/25', '2016/12/26', '2016/12/27'],
    '2017': [
      '2017/01/01',
      '2017/01/02',
      '2017/04/14',
      '2017/04/15',
      '2017/04/16',
      '2017/04/17',
      '2017/04/29',
      '2017/04/30',
      '2017/05/01',
      '2017/05/27',
      '2017/05/28',
      '2017/05/29',
      '2017/08/26',
      '2017/08/27',
      '2017/08/28',
      '2017/12/25',
      '2017/12/26'
    ],
    '2018': [
      '2018/01/01',
      '2018/03/30',
      '2018/03/31',
      '2018/04/01',
      '2018/04/02',
      '2018/05/05',
      '2018/05/06',
      '2018/05/07',
      '2018/05/26',
      '2018/05/27',
      '2018/05/28',
      '2018/08/25',
      '2018/08/26',
      '2018/08/27',
      '2018/12/25',
      '2018/12/26'
    ]
  },
  [exports.NAMED_CLOSURE_TYPE_ROSH_HASHANAH]: {
    '2017': ['2017/09/20', '2017/09/21', '2017/09/22'],
    '2018': ['2018/09/09', '2018/09/10', '2018/09/11']
  },
  [exports.NAMED_CLOSURE_TYPE_YOM_KIPPUR]: {
    '2017': ['2017/09/30'],
    '2018': ['2018/09/19']
  },
  [exports.NAMED_CLOSURE_TYPE_AUGUST]: {
    '2017': [
      '2017/08/01',
      '2017/08/02',
      '2017/08/03',
      '2017/08/04',
      '2017/08/05',
      '2017/08/06',
      '2017/08/07',
      '2017/08/08',
      '2017/08/09',
      '2017/08/10',
      '2017/08/11',
      '2017/08/12',
      '2017/08/13',
      '2017/08/14',
      '2017/08/15',
      '2017/08/16',
      '2017/08/17',
      '2017/08/18',
      '2017/08/19',
      '2017/08/20',
      '2017/08/21',
      '2017/08/22',
      '2017/08/23',
      '2017/08/24',
      '2017/08/25',
      '2017/08/26',
      '2017/08/27',
      '2017/08/28',
      '2017/08/29',
      '2017/08/30',
      '2017/08/31'
    ],
    '2018': [
      '2018/08/01',
      '2018/08/02',
      '2018/08/03',
      '2018/08/04',
      '2018/08/05',
      '2018/08/06',
      '2018/08/07',
      '2018/08/08',
      '2018/08/09',
      '2018/08/10',
      '2018/08/11',
      '2018/08/12',
      '2018/08/13',
      '2018/08/14',
      '2018/08/15',
      '2018/08/16',
      '2018/08/17',
      '2018/08/18',
      '2018/08/19',
      '2018/08/20',
      '2018/08/21',
      '2018/08/22',
      '2018/08/23',
      '2018/08/24',
      '2018/08/25',
      '2018/08/26',
      '2018/08/27',
      '2018/08/28',
      '2018/08/29',
      '2018/08/30',
      '2018/08/31'
    ]
  }
};

exports.WHEELCHAIR_ACCESS_TYPE_FULL_ACCESS = 'FullAccess';
exports.WHEELCHAIR_ACCESS_TYPE_PARTIAL_ACCESS = 'PartialAccess';
exports.WHEELCHAIR_ACCESS_TYPE_NO_ACCESS = 'NoAccess';
exports.WHEELCHAIR_ACCESS_TYPE_UNKNOWN = 'Unknown';
exports.WHEELCHAIR_ACCESS_TYPE_NOT_APPLICABLE = 'NotApplicable';

exports.ALLOWED_WHEELCHAIR_ACCESS_TYPES = [
  exports.WHEELCHAIR_ACCESS_TYPE_FULL_ACCESS,
  exports.WHEELCHAIR_ACCESS_TYPE_PARTIAL_ACCESS,
  exports.WHEELCHAIR_ACCESS_TYPE_NO_ACCESS,
  exports.WHEELCHAIR_ACCESS_TYPE_UNKNOWN,
  exports.WHEELCHAIR_ACCESS_TYPE_NOT_APPLICABLE
];

exports.DISABLED_BATHROOM_TYPE_PRESENT = 'Present';
exports.DISABLED_BATHROOM_TYPE_NOT_PRESENT = 'NotPresent';
exports.DISABLED_BATHROOM_TYPE_UNKNOWN = 'Unknown';
exports.DISABLED_BATHROOM_TYPE_NOT_APPLICABLE = 'NotApplicable';

exports.ALLOWED_DISABLED_BATHROOM_TYPES = [
  exports.DISABLED_BATHROOM_TYPE_PRESENT,
  exports.DISABLED_BATHROOM_TYPE_NOT_PRESENT,
  exports.DISABLED_BATHROOM_TYPE_UNKNOWN,
  exports.DISABLED_BATHROOM_TYPE_NOT_APPLICABLE
];

exports.HEARING_FACILITIES_TYPE_HEARING_LOOPS = 'HearingLoops';
exports.HEARING_FACILITIES_TYPE_PARTIAL_HEARING_LOOPS = 'PartialHearingLoops';
exports.HEARING_FACILITIES_TYPE_NO_HEARING_LOOPS = 'NoHearingLoops';
exports.HEARING_FACILITIES_TYPE_UNKNOWN = 'Unknown';
exports.HEARING_FACILITIES_TYPE_NOT_APPLICABLE = 'NotApplicable';

exports.ALLOWED_HEARING_FACILITIES_TYPES = [
  exports.HEARING_FACILITIES_TYPE_HEARING_LOOPS,
  exports.HEARING_FACILITIES_TYPE_PARTIAL_HEARING_LOOPS,
  exports.HEARING_FACILITIES_TYPE_NO_HEARING_LOOPS,
  exports.HEARING_FACILITIES_TYPE_UNKNOWN,
  exports.HEARING_FACILITIES_TYPE_NOT_APPLICABLE
];

exports.SEARCH_INDEX_TYPE_TALENT_FULL = 'talent-full';
exports.SEARCH_INDEX_TYPE_TALENT_AUTO = 'talent-auto';
exports.SEARCH_INDEX_TYPE_VENUE_FULL = 'venue-full';
exports.SEARCH_INDEX_TYPE_VENUE_AUTO = 'venue-auto';
exports.SEARCH_INDEX_TYPE_EVENT_SERIES_FULL = 'event-series-full';
exports.SEARCH_INDEX_TYPE_EVENT_SERIES_AUTO = 'event-series-auto';
exports.SEARCH_INDEX_TYPE_EVENT_FULL = 'event-full';
exports.SEARCH_INDEX_TYPE_COMBINED_EVENT_AUTO = 'combined-event-auto';

exports.ALLOWED_SEARCH_INDEX_TYPES = [
  exports.SEARCH_INDEX_TYPE_TALENT_FULL,
  exports.SEARCH_INDEX_TYPE_TALENT_AUTO,
  exports.SEARCH_INDEX_TYPE_VENUE_FULL,
  exports.SEARCH_INDEX_TYPE_VENUE_AUTO,
  exports.SEARCH_INDEX_TYPE_EVENT_SERIES_FULL,
  exports.SEARCH_INDEX_TYPE_EVENT_SERIES_AUTO,
  exports.SEARCH_INDEX_TYPE_EVENT_FULL,
  exports.SEARCH_INDEX_TYPE_COMBINED_EVENT_AUTO
];

exports.ENTITIES_FOR_SEARCH_INDEX_TYPES = {
  [exports.SEARCH_INDEX_TYPE_TALENT_FULL]: [exports.ENTITY_TYPE_TALENT],
  [exports.SEARCH_INDEX_TYPE_TALENT_AUTO]: [exports.ENTITY_TYPE_TALENT],
  [exports.SEARCH_INDEX_TYPE_VENUE_FULL]: [exports.ENTITY_TYPE_VENUE],
  [exports.SEARCH_INDEX_TYPE_VENUE_AUTO]: [exports.ENTITY_TYPE_VENUE],
  [exports.SEARCH_INDEX_TYPE_EVENT_SERIES_FULL]: [
    exports.ENTITY_TYPE_EVENT_SERIES
  ],
  [exports.SEARCH_INDEX_TYPE_EVENT_SERIES_AUTO]: [
    exports.ENTITY_TYPE_EVENT_SERIES
  ],
  [exports.SEARCH_INDEX_TYPE_EVENT_FULL]: [exports.ENTITY_TYPE_EVENT],
  [exports.SEARCH_INDEX_TYPE_COMBINED_EVENT_AUTO]: [
    exports.ENTITY_TYPE_EVENT,
    exports.ENTITY_TYPE_EVENT_SERIES
  ]
};
