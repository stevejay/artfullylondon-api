// The fields of industrial design, graphic design, fashion design,
// interior design, and the decorative arts are considered applied arts.
// In a creative or abstract context, the fields of architecture and
// photography are also considered applied arts.

export const VISUAL_ARTS_MEDIUMS = [
  "medium/applied-arts",
  "medium/architecture",
  "medium/ceramics",
  "medium/computer-art",
  "medium/conceptual-art",
  "medium/drawing",
  "medium/graphic-design",
  "medium/installation",
  "medium/painting",
  "medium/photography",
  "medium/printmaking",
  "medium/sculpture",
  "medium/textiles",
  "medium/video-art",
  "medium/fashion",
  "medium/design",
  "medium/mixed-media",
  "medium/multimedia"
];

export const PERFORMING_ARTS_MEDIUMS = [
  "medium/circus-arts",
  "medium/dance",
  "medium/mime",
  "medium/musical-theatre",
  "medium/opera",
  "medium/performance-art",
  "medium/puppetry",
  "medium/theatre"
];

export const CREATIVE_WRITING_MEDIUMS = ["medium/literature", "medium/poetry"];

export const NAMED_CLOSURE_TYPE_BANK_HOLIDAYS = "BankHolidays";
export const NAMED_CLOSURE_TYPE_BANK_HOLIDAY_WEEKENDS = "BankHolidayWeekends";
export const NAMED_CLOSURE_TYPE_CHRISTMAS_EVE = "ChristmasEve";
export const NAMED_CLOSURE_TYPE_CHRISTMAS_DAY = "ChristmasDay";
export const NAMED_CLOSURE_TYPE_BOXING_DAY = "BoxingDay";
export const NAMED_CLOSURE_TYPE_NEW_YEARS_EVE = "NewYearsEve";
export const NAMED_CLOSURE_TYPE_NEW_YEARS_DAY = "NewYearsDay";
export const NAMED_CLOSURE_TYPE_CHRISTMAS_PERIOD = "ChristmasPeriod";
export const NAMED_CLOSURE_TYPE_EASTER_SUNDAY = "EasterSunday";
export const NAMED_CLOSURE_TYPE_EASTER_HOLIDAY_PERIOD = "EasterHolidayPeriod";
export const NAMED_CLOSURE_TYPE_AUGUST_SATURDAYS = "AugustSaturdays";
export const NAMED_CLOSURE_TYPE_ROSH_HASHANAH = "RoshHashanah";
export const NAMED_CLOSURE_TYPE_YOM_KIPPUR = "YomKippur";
export const NAMED_CLOSURE_TYPE_AUGUST = "August";

export const NAMED_CLOSURE_DATES_LOOKUP = {
  [NAMED_CLOSURE_TYPE_AUGUST_SATURDAYS]: {
    "2017": ["2017/08/05", "2017/08/12", "2017/08/19", "2017/08/26"],
    "2018": ["2017/08/04", "2017/08/11", "2017/08/18", "2017/08/25"]
  },
  [NAMED_CLOSURE_TYPE_EASTER_SUNDAY]: {
    "2017": ["2017/04/16"],
    "2018": ["2018/04/01"]
  },
  [NAMED_CLOSURE_TYPE_EASTER_HOLIDAY_PERIOD]: {
    "2017": ["2017/04/14", "2017/04/15", "2017/04/16", "2017/04/17"],
    "2018": ["2018/03/30", "2018/03/31", "2018/04/01", "2018/04/02"]
  },
  [NAMED_CLOSURE_TYPE_CHRISTMAS_EVE]: {
    "2016": ["2016/12/24"],
    "2017": ["2017/12/24"],
    "2018": ["2018/12/24"]
  },
  [NAMED_CLOSURE_TYPE_CHRISTMAS_DAY]: {
    "2016": ["2016/12/25"],
    "2017": ["2017/12/25"],
    "2018": ["2018/12/25"]
  },
  [NAMED_CLOSURE_TYPE_BOXING_DAY]: {
    "2016": ["2016/12/26"],
    "2017": ["2017/12/26"],
    "2018": ["2018/12/26"]
  },
  [NAMED_CLOSURE_TYPE_BOXING_DAY]: {
    "2016": ["2016/12/26"],
    "2017": ["2017/12/26"],
    "2018": ["2018/12/26"]
  },
  [NAMED_CLOSURE_TYPE_NEW_YEARS_EVE]: {
    "2016": ["2016/12/31"],
    "2017": ["2017/12/31"],
    "2018": ["2018/12/31"]
  },
  [NAMED_CLOSURE_TYPE_NEW_YEARS_DAY]: {
    "2017": ["2017/01/01"],
    "2018": ["2018/01/01"]
  },
  [NAMED_CLOSURE_TYPE_CHRISTMAS_PERIOD]: {
    "2016": [
      "2016/12/24",
      "2016/12/25",
      "2016/12/26",
      "2016/12/27",
      "2016/12/28",
      "2016/12/29",
      "2016/12/30",
      "2016/12/31",
      "2017/01/01",
      "2017/01/02"
    ],
    "2017": [
      "2017/12/24",
      "2017/12/25",
      "2017/12/26",
      "2017/12/27",
      "2017/12/28",
      "2017/12/29",
      "2017/12/30",
      "2017/12/31",
      "2018/01/01"
    ],
    "2018": [
      "2018/12/24",
      "2018/12/25",
      "2018/12/26",
      "2018/12/27",
      "2018/12/28",
      "2018/12/29",
      "2018/12/30",
      "2018/12/31",
      "2019/01/01"
    ]
  },
  [NAMED_CLOSURE_TYPE_BANK_HOLIDAYS]: {
    "2016": ["2016/12/25", "2016/12/26", "2016/12/27"],
    "2017": [
      "2017/01/01",
      "2017/01/02",
      "2017/04/14",
      "2017/04/17",
      "2017/05/01",
      "2017/05/29",
      "2017/08/28",
      "2017/12/25",
      "2017/12/26"
    ],
    "2018": [
      "2018/01/01",
      "2018/03/30",
      "2018/04/02",
      "2018/05/07",
      "2018/05/28",
      "2018/08/27",
      "2018/12/25",
      "2018/12/26"
    ]
  },
  [NAMED_CLOSURE_TYPE_BANK_HOLIDAY_WEEKENDS]: {
    "2016": ["2016/12/25", "2016/12/26", "2016/12/27"],
    "2017": [
      "2017/01/01",
      "2017/01/02",
      "2017/04/14",
      "2017/04/15",
      "2017/04/16",
      "2017/04/17",
      "2017/04/29",
      "2017/04/30",
      "2017/05/01",
      "2017/05/27",
      "2017/05/28",
      "2017/05/29",
      "2017/08/26",
      "2017/08/27",
      "2017/08/28",
      "2017/12/25",
      "2017/12/26"
    ],
    "2018": [
      "2018/01/01",
      "2018/03/30",
      "2018/03/31",
      "2018/04/01",
      "2018/04/02",
      "2018/05/05",
      "2018/05/06",
      "2018/05/07",
      "2018/05/26",
      "2018/05/27",
      "2018/05/28",
      "2018/08/25",
      "2018/08/26",
      "2018/08/27",
      "2018/12/25",
      "2018/12/26"
    ]
  },
  [NAMED_CLOSURE_TYPE_ROSH_HASHANAH]: {
    "2017": ["2017/09/20", "2017/09/21", "2017/09/22"],
    "2018": ["2018/09/09", "2018/09/10", "2018/09/11"]
  },
  [NAMED_CLOSURE_TYPE_YOM_KIPPUR]: {
    "2017": ["2017/09/30"],
    "2018": ["2018/09/19"]
  },
  [NAMED_CLOSURE_TYPE_AUGUST]: {
    "2017": [
      "2017/08/01",
      "2017/08/02",
      "2017/08/03",
      "2017/08/04",
      "2017/08/05",
      "2017/08/06",
      "2017/08/07",
      "2017/08/08",
      "2017/08/09",
      "2017/08/10",
      "2017/08/11",
      "2017/08/12",
      "2017/08/13",
      "2017/08/14",
      "2017/08/15",
      "2017/08/16",
      "2017/08/17",
      "2017/08/18",
      "2017/08/19",
      "2017/08/20",
      "2017/08/21",
      "2017/08/22",
      "2017/08/23",
      "2017/08/24",
      "2017/08/25",
      "2017/08/26",
      "2017/08/27",
      "2017/08/28",
      "2017/08/29",
      "2017/08/30",
      "2017/08/31"
    ],
    "2018": [
      "2018/08/01",
      "2018/08/02",
      "2018/08/03",
      "2018/08/04",
      "2018/08/05",
      "2018/08/06",
      "2018/08/07",
      "2018/08/08",
      "2018/08/09",
      "2018/08/10",
      "2018/08/11",
      "2018/08/12",
      "2018/08/13",
      "2018/08/14",
      "2018/08/15",
      "2018/08/16",
      "2018/08/17",
      "2018/08/18",
      "2018/08/19",
      "2018/08/20",
      "2018/08/21",
      "2018/08/22",
      "2018/08/23",
      "2018/08/24",
      "2018/08/25",
      "2018/08/26",
      "2018/08/27",
      "2018/08/28",
      "2018/08/29",
      "2018/08/30",
      "2018/08/31"
    ]
  }
};
