"use strict";

const deepFreeze = require("deep-freeze");
const search = require("./search");
const constants = require("./constants");

describe("search", () => {
  describe("getActiveDayTimes", () => {
    const tests = [
      {
        it: "should handle no times ranges",
        args: {
          date: "2017/01/20",
          dayTimes: [{ from: "18:00", to: "18:00" }],
          timesRanges: null
        },
        expected: [{ from: "18:00", to: "18:00" }]
      },
      {
        it: "should handle day times not for the applicable times range",
        args: {
          date: "2017/01/23",
          dayTimes: [{ timesRangeId: "normal", from: "18:00", to: "18:00" }],
          timesRanges: [
            { id: "previews", dateFrom: "2017/01/21", dateTo: "2017/01/25" }
          ]
        },
        expected: []
      },
      {
        it: "should handle some day times for the applicable times range",
        args: {
          date: "2017/01/23",
          dayTimes: [
            { timesRangeId: "normal", from: "18:00", to: "18:00" },
            { timesRangeId: "previews", from: "19:00", to: "19:00" }
          ],
          timesRanges: [
            { id: "previews", dateFrom: "2017/01/21", dateTo: "2017/01/25" }
          ]
        },
        expected: [{ timesRangeId: "previews", from: "19:00", to: "19:00" }]
      },
      {
        it: "should handle times ranges that do not apply for the date",
        args: {
          date: "2017/01/20",
          dayTimes: [{ from: "18:00", to: "18:00", timesRangeId: "previews" }],
          timesRanges: [
            { id: "previews", dateFrom: "2017/01/21", dateTo: "2017/01/25" }
          ]
        },
        expected: []
      },
      {
        it: "should handle times ranges that allow the day time",
        args: {
          date: "2017/01/20",
          dayTimes: [{ from: "18:00", to: "18:00", timesRangeId: "previews" }],
          timesRanges: [
            { id: "previews", dateFrom: "2017/01/20", dateTo: "2017/01/25" }
          ]
        },
        expected: [{ from: "18:00", to: "18:00", timesRangeId: "previews" }]
      }
    ];

    tests.forEach(test => {
      it(test.it, () => {
        const actual = search.getActiveDayTimes(
          test.args.dayTimes,
          test.args.date,
          test.args.timesRanges
        );

        expect(actual).toEqual(test.expected);
      });
    });
  });

  describe("getEventDateRange", () => {
    const tests = [
      {
        it: "should handle a continuous event",
        args: {
          event: {
            occurrenceType: constants.OCCURRENCE_TYPE_CONTINUOUS
          },
          dateTodayStr: "2016/12/10",
          dateMaxStr: "2016/12/20"
        },
        expected: {
          from: "2016/12/10",
          to: "2016/12/20"
        }
      },
      {
        it: "should handle a bounded event",
        args: {
          event: {
            occurrenceType: constants.OCCURRENCE_TYPE_BOUNDED,
            dateFrom: "2016/12/12",
            dateTo: "2016/12/14"
          },
          dateTodayStr: "2016/12/10",
          dateMaxStr: "2016/12/20"
        },
        expected: {
          from: "2016/12/12",
          to: "2016/12/14"
        }
      },
      {
        it: "should handle a bounded event that starts before date today",
        args: {
          event: {
            occurrenceType: constants.OCCURRENCE_TYPE_BOUNDED,
            dateFrom: "2016/12/01",
            dateTo: "2016/12/14"
          },
          dateTodayStr: "2016/12/10",
          dateMaxStr: "2016/12/20"
        },
        expected: {
          from: "2016/12/10",
          to: "2016/12/14"
        }
      },
      {
        it: "should handle a bounded event that ends after date max",
        args: {
          event: {
            occurrenceType: constants.OCCURRENCE_TYPE_BOUNDED,
            dateFrom: "2016/12/12",
            dateTo: "2016/12/30"
          },
          dateTodayStr: "2016/12/10",
          dateMaxStr: "2016/12/20"
        },
        expected: {
          from: "2016/12/12",
          to: "2016/12/20"
        }
      },
      {
        it: "should handle a bounded event that is before date today",
        args: {
          event: {
            occurrenceType: constants.OCCURRENCE_TYPE_BOUNDED,
            dateFrom: "2016/12/01",
            dateTo: "2016/12/03"
          },
          dateTodayStr: "2016/12/10",
          dateMaxStr: "2016/12/20"
        },
        expected: null
      },
      {
        it: "should handle a bounded event that is after date max",
        args: {
          event: {
            occurrenceType: constants.OCCURRENCE_TYPE_BOUNDED,
            dateFrom: "2016/12/25",
            dateTo: "2016/12/30"
          },
          dateTodayStr: "2016/12/10",
          dateMaxStr: "2016/12/20"
        },
        expected: null
      },
      {
        it: "should handle a one time event at the start of the range",
        args: {
          event: {
            occurrenceType: constants.OCCURRENCE_TYPE_ONETIME,
            dateFrom: "2016/12/10",
            dateTo: "2016/12/10"
          },
          dateTodayStr: "2016/12/10",
          dateMaxStr: "2016/12/20"
        },
        expected: {
          from: "2016/12/10",
          to: "2016/12/10"
        }
      },
      {
        it: "should handle a one time event at the end of the range",
        args: {
          event: {
            occurrenceType: constants.OCCURRENCE_TYPE_ONETIME,
            dateFrom: "2016/12/20",
            dateTo: "2016/12/20"
          },
          dateTodayStr: "2016/12/10",
          dateMaxStr: "2016/12/20"
        },
        expected: {
          from: "2016/12/20",
          to: "2016/12/20"
        }
      },
      {
        it: "should handle a one time event before date today",
        args: {
          event: {
            occurrenceType: constants.OCCURRENCE_TYPE_ONETIME,
            dateFrom: "2016/12/01",
            dateTo: "2016/12/01"
          },
          dateTodayStr: "2016/12/10",
          dateMaxStr: "2016/12/20"
        },
        expected: null
      },
      {
        it: "should handle a one time event after date max",
        args: {
          event: {
            occurrenceType: constants.OCCURRENCE_TYPE_ONETIME,
            dateFrom: "2016/12/30",
            dateTo: "2016/12/30"
          },
          dateTodayStr: "2016/12/10",
          dateMaxStr: "2016/12/20"
        },
        expected: null
      }
    ];

    tests.forEach(test => {
      it(test.it, () => {
        const actual = search.getEventDateRange(
          test.args.event,
          test.args.dateTodayStr,
          test.args.dateMaxStr
        );

        expect(actual).toEqual(test.expected);
      });
    });
  });

  describe("createInitialDatesLookup", () => {
    const tests = [
      {
        it: "should handle a null range",
        args: {
          range: null
        },
        expected: null
      },
      {
        it: "should handle a reversed range",
        args: {
          range: { from: "2016/12/20", to: "2016/12/10" }
        },
        expected: null
      },
      {
        it: "should add dates for a valid range",
        args: {
          range: { from: "2016/12/20", to: "2016/12/25" }
        },
        expected: {
          "2016/12/20": { day: 1, times: [] },
          "2016/12/21": { day: 2, times: [] },
          "2016/12/22": { day: 3, times: [] },
          "2016/12/23": { day: 4, times: [] },
          "2016/12/24": { day: 5, times: [] },
          "2016/12/25": { day: 6, times: [] }
        }
      }
    ];

    tests.forEach(test => {
      it(test.it, () => {
        const actual = search.createInitialDatesLookup(test.args.range);
        expect(actual).toEqual(test.expected);
      });
    });
  });

  describe("removeSoldOutPerformances", () => {
    const tests = [
      {
        it: "should handle null sold out performances",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_PERFORMANCE,
            soldOutPerformances: null
          },
          dates: {
            "2016/12/23": { day: 4, times: [{ from: "12:00", to: "12:00" }] },
            "2016/12/24": { day: 5, times: [{ from: "13:00", to: "13:00" }] },
            "2016/12/25": { day: 6, times: [{ from: "14:00", to: "14:00" }] }
          }
        },
        expected: {
          "2016/12/23": { day: 4, times: [{ from: "12:00", to: "12:00" }] },
          "2016/12/24": { day: 5, times: [{ from: "13:00", to: "13:00" }] },
          "2016/12/25": { day: 6, times: [{ from: "14:00", to: "14:00" }] }
        }
      },
      {
        it: "should handle empty sold out performances",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_PERFORMANCE,
            soldOutPerformances: []
          },
          dates: {
            "2016/12/23": { day: 4, times: [{ from: "12:00", to: "12:00" }] },
            "2016/12/24": { day: 5, times: [{ from: "13:00", to: "13:00" }] },
            "2016/12/25": { day: 6, times: [{ from: "14:00", to: "14:00" }] }
          }
        },
        expected: {
          "2016/12/23": { day: 4, times: [{ from: "12:00", to: "12:00" }] },
          "2016/12/24": { day: 5, times: [{ from: "13:00", to: "13:00" }] },
          "2016/12/25": { day: 6, times: [{ from: "14:00", to: "14:00" }] }
        }
      },
      {
        it: "should handle sold out performances that do not apply",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_PERFORMANCE,
            soldOutPerformances: [{ date: "2016/12/23", at: "18:00" }]
          },
          dates: {
            "2016/12/23": { day: 4, times: [{ from: "12:00", to: "12:00" }] },
            "2016/12/24": { day: 5, times: [{ from: "13:00", to: "13:00" }] },
            "2016/12/25": { day: 6, times: [{ from: "14:00", to: "14:00" }] }
          }
        },
        expected: {
          "2016/12/23": { day: 4, times: [{ from: "12:00", to: "12:00" }] },
          "2016/12/24": { day: 5, times: [{ from: "13:00", to: "13:00" }] },
          "2016/12/25": { day: 6, times: [{ from: "14:00", to: "14:00" }] }
        }
      },
      {
        it: "should handle a sold out performance that applies",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_PERFORMANCE,
            soldOutPerformances: [{ date: "2016/12/23", at: "12:00" }]
          },
          dates: {
            "2016/12/23": { day: 4, times: [{ from: "12:00", to: "12:00" }] },
            "2016/12/24": { day: 5, times: [{ from: "13:00", to: "13:00" }] },
            "2016/12/25": { day: 6, times: [{ from: "14:00", to: "14:00" }] }
          }
        },
        expected: {
          "2016/12/24": { day: 5, times: [{ from: "13:00", to: "13:00" }] },
          "2016/12/25": { day: 6, times: [{ from: "14:00", to: "14:00" }] }
        }
      },
      {
        it:
          "should handle a sold out performance that applies on a day that has multiple performances",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_PERFORMANCE,
            soldOutPerformances: [{ date: "2016/12/23", at: "18:00" }]
          },
          dates: {
            "2016/12/23": {
              day: 4,
              times: [
                { from: "12:00", to: "12:00" },
                { from: "18:00", to: "18:00" }
              ]
            },
            "2016/12/25": { day: 6, times: [{ from: "14:00", to: "14:00" }] }
          }
        },
        expected: {
          "2016/12/23": { day: 4, times: [{ from: "12:00", to: "12:00" }] },
          "2016/12/25": { day: 6, times: [{ from: "14:00", to: "14:00" }] }
        }
      }
    ];

    tests.forEach(test => {
      it(test.it, () => {
        const actual = search.removeSoldOutPerformances(
          test.args.event,
          deepFreeze(test.args.dates)
        );

        expect(actual).toEqual(test.expected);
      });
    });
  });

  describe("removeNamedClosuresDates", () => {
    const tests = [
      {
        it: "should ignore a performance event",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_PERFORMANCE,
            useVenueOpeningTimes: true,
            venue: {
              namedClosures: ["ChristmasDay"]
            }
          },
          dates: {
            "2016/12/23": { day: 4, times: [] },
            "2016/12/24": { day: 5, times: [] },
            "2016/12/25": { day: 6, times: [] }
          },
          namedClosuresLookup: {
            ChristmasDay: {
              "2016": ["2016/12/25"],
              "2017": ["2017/12/25"]
            }
          }
        },
        expected: {
          "2016/12/23": { day: 4, times: [] },
          "2016/12/24": { day: 5, times: [] },
          "2016/12/25": { day: 6, times: [] }
        }
      },
      {
        it:
          "should ignore a exhibition event that is not using the venue opening times",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_EXHIBITION,
            useVenueOpeningTimes: false,
            venue: {
              namedClosures: ["ChristmasDay"]
            }
          },
          dates: {
            "2016/12/23": { day: 4, times: [] },
            "2016/12/24": { day: 5, times: [] },
            "2016/12/25": { day: 6, times: [] }
          },
          namedClosuresLookup: {
            ChristmasDay: {
              "2016": ["2016/12/25"],
              "2017": ["2017/12/25"]
            }
          }
        },
        expected: {
          "2016/12/23": { day: 4, times: [] },
          "2016/12/24": { day: 5, times: [] },
          "2016/12/25": { day: 6, times: [] }
        }
      },
      {
        it: "should ignore a exhibition event with no named closures",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_EXHIBITION,
            useVenueOpeningTimes: true,
            venue: {}
          },
          dates: {
            "2016/12/23": { day: 4, times: [] },
            "2016/12/24": { day: 5, times: [] },
            "2016/12/25": { day: 6, times: [] }
          },
          namedClosuresLookup: {
            ChristmasDay: {
              "2016": ["2016/12/25"],
              "2017": ["2017/12/25"]
            }
          }
        },
        expected: {
          "2016/12/23": { day: 4, times: [] },
          "2016/12/24": { day: 5, times: [] },
          "2016/12/25": { day: 6, times: [] }
        }
      },
      {
        it: "should remove named closures for an exhibition event",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_EXHIBITION,
            useVenueOpeningTimes: true,
            venue: {
              namedClosures: ["ChristmasDay"]
            }
          },
          dates: {
            "2016/12/23": { day: 4, times: [] },
            "2016/12/24": { day: 5, times: [] },
            "2016/12/25": { day: 6, times: [] }
          },
          namedClosuresLookup: {
            ChristmasDay: {
              "2016": ["2016/12/25"],
              "2017": ["2017/12/25"]
            }
          }
        },
        expected: {
          "2016/12/23": { day: 4, times: [] },
          "2016/12/24": { day: 5, times: [] }
        }
      }
    ];

    tests.forEach(test => {
      it(test.it, () => {
        const actual = search.removeNamedClosuresDates(
          test.args.event,
          deepFreeze(test.args.dates),
          test.args.namedClosuresLookup
        );

        expect(actual).toEqual(test.expected);
      });
    });
  });

  describe("removeFullDayClosureDates", () => {
    const tests = [
      {
        it: "should handle performance event with no closures",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_PERFORMANCE
          },
          dates: {
            "2016/12/23": { day: 4, times: [] },
            "2016/12/24": { day: 5, times: [] },
            "2016/12/25": { day: 6, times: [] }
          }
        },
        expected: {
          "2016/12/23": { day: 4, times: [] },
          "2016/12/24": { day: 5, times: [] },
          "2016/12/25": { day: 6, times: [] }
        }
      },
      {
        it: "should handle performance event with no full day closures",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_PERFORMANCE,
            performancesClosures: [{ date: "2016/12/23", at: "14:00" }]
          },
          dates: {
            "2016/12/23": { day: 4, times: [] },
            "2016/12/24": { day: 5, times: [] },
            "2016/12/25": { day: 6, times: [] }
          }
        },
        expected: {
          "2016/12/23": { day: 4, times: [] },
          "2016/12/24": { day: 5, times: [] },
          "2016/12/25": { day: 6, times: [] }
        }
      },
      {
        it: "should handle performance event with full day closures",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_PERFORMANCE,
            performancesClosures: [
              { date: "2016/12/23", at: "14:00" },
              { date: "2016/12/24" }
            ]
          },
          dates: {
            "2016/12/23": { day: 4, times: [] },
            "2016/12/24": { day: 5, times: [] },
            "2016/12/25": { day: 6, times: [] }
          }
        },
        expected: {
          "2016/12/23": { day: 4, times: [] },
          "2016/12/25": { day: 6, times: [] }
        }
      },
      {
        it: "should handle exhibition event with no full day closures",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_EXHIBITION,
            openingTimesClosures: [
              { date: "2016/12/23", from: "14:00", to: "16:00" }
            ]
          },
          dates: {
            "2016/12/23": { day: 4, times: [] },
            "2016/12/24": { day: 5, times: [] },
            "2016/12/25": { day: 6, times: [] }
          }
        },
        expected: {
          "2016/12/23": { day: 4, times: [] },
          "2016/12/24": { day: 5, times: [] },
          "2016/12/25": { day: 6, times: [] }
        }
      },
      {
        it: "should handle exhibition event with full day closures",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_EXHIBITION,
            useVenueOpeningTimes: true,
            openingTimesClosures: [
              { date: "2016/12/23", from: "14:00", to: "16:00" },
              { date: "2016/12/24" }
            ],
            venue: {}
          },
          dates: {
            "2016/12/23": { day: 4, times: [] },
            "2016/12/24": { day: 5, times: [] },
            "2016/12/25": { day: 6, times: [] }
          }
        },
        expected: {
          "2016/12/23": { day: 4, times: [] },
          "2016/12/25": { day: 6, times: [] }
        }
      },
      {
        it: "should handle exhibition event with venue full day closures",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_EXHIBITION,
            useVenueOpeningTimes: true,
            venue: {
              openingTimesClosures: [
                { date: "2016/12/23", from: "14:00", to: "16:00" },
                { date: "2016/12/24" }
              ]
            }
          },
          dates: {
            "2016/12/23": { day: 4, times: [] },
            "2016/12/24": { day: 5, times: [] },
            "2016/12/25": { day: 6, times: [] }
          }
        },
        expected: {
          "2016/12/23": { day: 4, times: [] },
          "2016/12/25": { day: 6, times: [] }
        }
      },
      {
        it:
          "should handle exhibition event with event and venue full day closures",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_EXHIBITION,
            useVenueOpeningTimes: true,
            openingTimesClosures: [{ date: "2016/12/23" }],
            venue: {
              openingTimesClosures: [{ date: "2016/12/24" }]
            }
          },
          dates: {
            "2016/12/23": { day: 4, times: [] },
            "2016/12/24": { day: 5, times: [] },
            "2016/12/25": { day: 6, times: [] }
          }
        },
        expected: {
          "2016/12/25": { day: 6, times: [] }
        }
      },
      {
        it:
          "should handle exhibition event with event and venue full day closures but venue times are not being used",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_EXHIBITION,
            useVenueOpeningTimes: false,
            openingTimesClosures: [{ date: "2016/12/23" }],
            venue: {
              openingTimesClosures: [{ date: "2016/12/24" }]
            }
          },
          dates: {
            "2016/12/23": { day: 4, times: [] },
            "2016/12/24": { day: 5, times: [] },
            "2016/12/25": { day: 6, times: [] }
          }
        },
        expected: {
          "2016/12/24": { day: 5, times: [] },
          "2016/12/25": { day: 6, times: [] }
        }
      }
    ];

    tests.forEach(test => {
      it(test.it, () => {
        const actual = search.removeFullDayClosureDates(
          test.args.event,
          deepFreeze(test.args.dates)
        );

        expect(actual).toEqual(test.expected);
      });
    });
  });

  describe("addRegularTimes", () => {
    const tests = [
      {
        it: "should handle no regular times for a performance event",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_PERFORMANCE
          },
          dates: {
            "2016/12/23": { day: 4, times: [] },
            "2016/12/24": { day: 5, times: [] },
            "2016/12/25": { day: 6, times: [] }
          }
        },
        expected: {
          "2016/12/23": { day: 4, times: [] },
          "2016/12/24": { day: 5, times: [] },
          "2016/12/25": { day: 6, times: [] }
        }
      },
      {
        it: "should handle no regular times for an exhibition event",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_EXHIBITION,
            useVenueOpeningTimes: false
          },
          dates: {
            "2016/12/23": { day: 4, times: [] },
            "2016/12/24": { day: 5, times: [] },
            "2016/12/25": { day: 6, times: [] }
          }
        },
        expected: {
          "2016/12/23": { day: 4, times: [] },
          "2016/12/24": { day: 5, times: [] },
          "2016/12/25": { day: 6, times: [] }
        }
      },
      {
        it:
          "should handle no regular times for an exhibition event that uses venue times",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_EXHIBITION,
            useVenueOpeningTimes: true,
            venue: {}
          },
          dates: {
            "2016/12/23": { day: 4, times: [] },
            "2016/12/24": { day: 5, times: [] },
            "2016/12/25": { day: 6, times: [] }
          }
        },
        expected: {
          "2016/12/23": { day: 4, times: [] },
          "2016/12/24": { day: 5, times: [] },
          "2016/12/25": { day: 6, times: [] }
        }
      },
      {
        it: "should handle regular times for a performance event",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_PERFORMANCE,
            performances: [
              { day: 5, at: "12:00" },
              { day: 5, at: "14:00" },
              { day: 6, at: "09:00" }
            ]
          },
          dates: {
            "2016/12/23": { day: 4, times: [] },
            "2016/12/24": { day: 5, times: [] },
            "2016/12/25": { day: 6, times: [] }
          }
        },
        expected: {
          "2016/12/23": { day: 4, times: [] },
          "2016/12/24": {
            day: 5,
            times: [
              { from: "12:00", to: "12:00" },
              { from: "14:00", to: "14:00" }
            ]
          },
          "2016/12/25": {
            day: 6,
            times: [{ from: "09:00", to: "09:00" }]
          }
        }
      },
      {
        it: "should handle regular times for an exhibition event",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_EXHIBITION,
            openingTimes: [
              { day: 5, from: "12:00", to: "13:00" },
              { day: 5, from: "14:00", to: "15:00" },
              { day: 6, from: "09:00", to: "10:00" }
            ]
          },
          dates: {
            "2016/12/23": { day: 4, times: [] },
            "2016/12/24": { day: 5, times: [] },
            "2016/12/25": { day: 6, times: [] }
          }
        },
        expected: {
          "2016/12/23": { day: 4, times: [] },
          "2016/12/24": {
            day: 5,
            times: [
              { from: "12:00", to: "13:00" },
              { from: "14:00", to: "15:00" }
            ]
          },
          "2016/12/25": {
            day: 6,
            times: [{ from: "09:00", to: "10:00" }]
          }
        }
      },
      {
        it:
          "should handle regular times for an exhibition event that uses the venue times",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_EXHIBITION,
            useVenueOpeningTimes: true,
            venue: {
              openingTimes: [
                { day: 5, from: "12:00", to: "13:00" },
                { day: 5, from: "14:00", to: "15:00" },
                { day: 6, from: "09:00", to: "10:00" }
              ]
            }
          },
          dates: {
            "2016/12/23": { day: 4, times: [] },
            "2016/12/24": { day: 5, times: [] },
            "2016/12/25": { day: 6, times: [] }
          }
        },
        expected: {
          "2016/12/23": { day: 4, times: [] },
          "2016/12/24": {
            day: 5,
            times: [
              { from: "12:00", to: "13:00" },
              { from: "14:00", to: "15:00" }
            ]
          },
          "2016/12/25": {
            day: 6,
            times: [{ from: "09:00", to: "10:00" }]
          }
        }
      },
      {
        it:
          "should handle regular times with times ranges for a performance event",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_PERFORMANCE,
            timesRanges: [
              { id: "previews", dateFrom: "2016/12/20", dateTo: "2016/12/24" },
              { id: "normal", dateFrom: "2016/12/25", dateTo: "2016/12/30" }
            ],
            performances: [
              { day: 5, at: "12:00", timesRangeId: "previews" },
              { day: 5, at: "14:00", timesRangeId: "previews" },
              { day: 6, at: "09:00", timesRangeId: "normal" }
            ]
          },
          dates: {
            "2016/12/23": { day: 4, times: [] },
            "2016/12/24": { day: 5, times: [] },
            "2016/12/25": { day: 6, times: [] }
          }
        },
        expected: {
          "2016/12/23": { day: 4, times: [] },
          "2016/12/24": {
            day: 5,
            times: [
              { from: "12:00", to: "12:00" },
              { from: "14:00", to: "14:00" }
            ]
          },
          "2016/12/25": {
            day: 6,
            times: [{ from: "09:00", to: "09:00" }]
          }
        }
      },
      {
        it:
          "should handle regular times with times ranges rejection for a performance event",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_PERFORMANCE,
            timesRanges: [
              { id: "previews", dateFrom: "2016/12/20", dateTo: "2016/12/23" },
              { id: "normal", dateFrom: "2016/12/25", dateTo: "2016/12/30" }
            ],
            performances: [
              { day: 5, at: "12:00", timesRangeId: "previews" },
              { day: 5, at: "14:00", timesRangeId: "previews" },
              { day: 6, at: "09:00", timesRangeId: "normal" }
            ]
          },
          dates: {
            "2016/12/23": { day: 4, times: [] },
            "2016/12/24": { day: 5, times: [] },
            "2016/12/25": { day: 6, times: [] }
          }
        },
        expected: {
          "2016/12/23": { day: 4, times: [] },
          "2016/12/24": { day: 5, times: [] },
          "2016/12/25": {
            day: 6,
            times: [{ from: "09:00", to: "09:00" }]
          }
        }
      }
    ];

    tests.forEach(test => {
      it(test.it, () => {
        const actual = search.addRegularTimes(
          test.args.event,
          deepFreeze(test.args.dates)
        );

        expect(actual).toEqual(test.expected);
      });
    });
  });

  describe("addAdditionalTimes", () => {
    const tests = [
      {
        it: "should handle a performance event with no additional times",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_PERFORMANCE,
            venue: {}
          },
          dates: {
            "2016/12/23": { day: 4, times: [] },
            "2016/12/24": {
              day: 5,
              times: [
                { from: "12:00", to: "12:00" },
                { from: "14:00", to: "14:00" }
              ]
            },
            "2016/12/25": {
              day: 6,
              times: [{ from: "09:00", to: "09:00" }]
            }
          }
        },
        expected: {
          "2016/12/23": { day: 4, times: [] },
          "2016/12/24": {
            day: 5,
            times: [
              { from: "12:00", to: "12:00" },
              { from: "14:00", to: "14:00" }
            ]
          },
          "2016/12/25": {
            day: 6,
            times: [{ from: "09:00", to: "09:00" }]
          }
        }
      },
      {
        it: "should handle an exhibition event with no additional times",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_EXHIBITION,
            venue: {}
          },
          dates: {
            "2016/12/23": { day: 4, times: [] },
            "2016/12/24": {
              day: 5,
              times: [
                { from: "12:00", to: "13:00" },
                { from: "14:00", to: "15:00" }
              ]
            },
            "2016/12/25": {
              day: 6,
              times: [{ from: "09:00", to: "10:00" }]
            }
          }
        },
        expected: {
          "2016/12/23": { day: 4, times: [] },
          "2016/12/24": {
            day: 5,
            times: [
              { from: "12:00", to: "13:00" },
              { from: "14:00", to: "15:00" }
            ]
          },
          "2016/12/25": {
            day: 6,
            times: [{ from: "09:00", to: "10:00" }]
          }
        }
      },
      {
        it: "should handle a performance event with additional times",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_PERFORMANCE,
            additionalPerformances: [
              { date: "2016/12/23", at: "13:30" },
              { date: "2016/12/24", at: "13:00" }
            ],
            venue: {}
          },
          dates: {
            "2016/12/23": { day: 4, times: [] },
            "2016/12/24": {
              day: 5,
              times: [
                { from: "12:00", to: "12:00" },
                { from: "14:00", to: "14:00" }
              ]
            },
            "2016/12/25": {
              day: 6,
              times: [{ from: "09:00", to: "09:00" }]
            }
          }
        },
        expected: {
          "2016/12/23": {
            day: 4,
            times: [{ from: "13:30", to: "13:30" }]
          },
          "2016/12/24": {
            day: 5,
            times: [
              { from: "12:00", to: "12:00" },
              { from: "13:00", to: "13:00" },
              { from: "14:00", to: "14:00" }
            ]
          },
          "2016/12/25": {
            day: 6,
            times: [{ from: "09:00", to: "09:00" }]
          }
        }
      },
      {
        it: "should handle an exhibition event with additional times",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_EXHIBITION,
            additionalOpeningTimes: [
              { date: "2016/12/23", from: "13:30", to: "14:00" },
              { date: "2016/12/24", from: "13:30", to: "13:45" }
            ],
            venue: {}
          },
          dates: {
            "2016/12/23": { day: 4, times: [] },
            "2016/12/24": {
              day: 5,
              times: [
                { from: "12:00", to: "13:00" },
                { from: "14:00", to: "15:00" }
              ]
            },
            "2016/12/25": {
              day: 6,
              times: [{ from: "09:00", to: "10:00" }]
            }
          }
        },
        expected: {
          "2016/12/23": {
            day: 4,
            times: [{ from: "13:30", to: "14:00" }]
          },
          "2016/12/24": {
            day: 5,
            times: [
              { from: "12:00", to: "13:00" },
              { from: "13:30", to: "13:45" },
              { from: "14:00", to: "15:00" }
            ]
          },
          "2016/12/25": {
            day: 6,
            times: [{ from: "09:00", to: "10:00" }]
          }
        }
      },
      {
        it:
          "should handle an exhibition event with additional times on the venue",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_EXHIBITION,
            useVenueOpeningTimes: true,
            venue: {
              additionalOpeningTimes: [
                { date: "2016/12/23", from: "13:30", to: "14:00" },
                { date: "2016/12/24", from: "13:30", to: "13:45" }
              ]
            }
          },
          dates: {
            "2016/12/23": { day: 4, times: [] },
            "2016/12/24": {
              day: 5,
              times: [
                { from: "12:00", to: "13:00" },
                { from: "14:00", to: "15:00" }
              ]
            },
            "2016/12/25": {
              day: 6,
              times: [{ from: "09:00", to: "10:00" }]
            }
          }
        },
        expected: {
          "2016/12/23": {
            day: 4,
            times: [{ from: "13:30", to: "14:00" }]
          },
          "2016/12/24": {
            day: 5,
            times: [
              { from: "12:00", to: "13:00" },
              { from: "13:30", to: "13:45" },
              { from: "14:00", to: "15:00" }
            ]
          },
          "2016/12/25": {
            day: 6,
            times: [{ from: "09:00", to: "10:00" }]
          }
        }
      },
      {
        it:
          "should handle an exhibition event with additional times on the event and the venue",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_EXHIBITION,
            additionalOpeningTimes: [
              { date: "2016/12/23", from: "13:30", to: "14:00" },
              { date: "2016/12/24", from: "13:30", to: "13:45" },
              { date: "2016/12/24", from: "16:30", to: "16:45" }
            ],
            useVenueOpeningTimes: true,
            venue: {
              additionalOpeningTimes: [
                { date: "2016/12/23", from: "13:30", to: "14:00" },
                { date: "2016/12/24", from: "13:30", to: "13:45" },
                { date: "2016/12/24", from: "19:30", to: "19:45" }
              ]
            }
          },
          dates: {
            "2016/12/23": { day: 4, times: [] },
            "2016/12/24": {
              day: 5,
              times: [
                { from: "12:00", to: "13:00" },
                { from: "14:00", to: "15:00" }
              ]
            },
            "2016/12/25": {
              day: 6,
              times: [{ from: "09:00", to: "10:00" }]
            }
          }
        },
        expected: {
          "2016/12/23": {
            day: 4,
            times: [{ from: "13:30", to: "14:00" }]
          },
          "2016/12/24": {
            day: 5,
            times: [
              { from: "12:00", to: "13:00" },
              { from: "13:30", to: "13:45" },
              { from: "14:00", to: "15:00" },
              { from: "16:30", to: "16:45" },
              { from: "19:30", to: "19:45" }
            ]
          },
          "2016/12/25": {
            day: 6,
            times: [{ from: "09:00", to: "10:00" }]
          }
        }
      }
    ];

    tests.forEach(test => {
      it(test.it, () => {
        const actual = search.addAdditionalTimes(
          test.args.event,
          deepFreeze(test.args.dates)
        );

        expect(actual).toEqual(test.expected);
      });
    });
  });

  describe("removePartDayClosureDates", () => {
    const tests = [
      {
        it: "should handle no part day closures on a performance event",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_PERFORMANCE,
            performancesClosures: [{ date: "2016/12/24" }]
          },
          dates: {
            "2016/12/23": {
              day: 4,
              times: [{ from: "13:00", to: "13:00" }]
            },
            "2016/12/24": {
              day: 5,
              times: [
                { from: "12:00", to: "12:00" },
                { from: "14:00", to: "14:00" }
              ]
            },
            "2016/12/25": {
              day: 6,
              times: [{ from: "09:00", to: "09:00" }]
            }
          }
        },
        expected: {
          "2016/12/23": {
            day: 4,
            times: [{ from: "13:00", to: "13:00" }]
          },
          "2016/12/24": {
            day: 5,
            times: [
              { from: "12:00", to: "12:00" },
              { from: "14:00", to: "14:00" }
            ]
          },
          "2016/12/25": {
            day: 6,
            times: [{ from: "09:00", to: "09:00" }]
          }
        }
      },
      {
        it: "should handle no part day closures on an exhibition event",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_EXHIBITION,
            useVenueOpeningTimes: false,
            openingTimesClosures: [{ date: "2016/12/24" }]
          },
          dates: {
            "2016/12/23": {
              day: 4,
              times: [{ from: "13:30", to: "14:00" }]
            },
            "2016/12/24": {
              day: 5,
              times: [
                { from: "12:00", to: "13:00" },
                { from: "14:00", to: "15:00" }
              ]
            },
            "2016/12/25": {
              day: 6,
              times: [{ from: "09:00", to: "10:00" }]
            }
          }
        },
        expected: {
          "2016/12/23": {
            day: 4,
            times: [{ from: "13:30", to: "14:00" }]
          },
          "2016/12/24": {
            day: 5,
            times: [
              { from: "12:00", to: "13:00" },
              { from: "14:00", to: "15:00" }
            ]
          },
          "2016/12/25": {
            day: 6,
            times: [{ from: "09:00", to: "10:00" }]
          }
        }
      },
      {
        it:
          "should handle no part day closures on an exhibition event that uses venue times",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_EXHIBITION,
            useVenueOpeningTimes: true,
            venue: {
              openingTimesClosures: [{ date: "2016/12/24" }]
            }
          },
          dates: {
            "2016/12/23": {
              day: 4,
              times: [{ from: "13:30", to: "14:00" }]
            },
            "2016/12/24": {
              day: 5,
              times: [
                { from: "12:00", to: "13:00" },
                { from: "14:00", to: "15:00" }
              ]
            },
            "2016/12/25": {
              day: 6,
              times: [{ from: "09:00", to: "10:00" }]
            }
          }
        },
        expected: {
          "2016/12/23": {
            day: 4,
            times: [{ from: "13:30", to: "14:00" }]
          },
          "2016/12/24": {
            day: 5,
            times: [
              { from: "12:00", to: "13:00" },
              { from: "14:00", to: "15:00" }
            ]
          },
          "2016/12/25": {
            day: 6,
            times: [{ from: "09:00", to: "10:00" }]
          }
        }
      },
      {
        it: "should handle part day closures on a performance event",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_PERFORMANCE,
            performancesClosures: [
              { date: "2016/12/24", at: "12:00" },
              { date: "2016/12/24", at: "18:00" },
              { date: "2016/12/25" }
            ]
          },
          dates: {
            "2016/12/23": {
              day: 4,
              times: [{ from: "13:00", to: "13:00" }]
            },
            "2016/12/24": {
              day: 5,
              times: [
                { from: "12:00", to: "12:00" },
                { from: "14:00", to: "14:00" }
              ]
            },
            "2016/12/25": {
              day: 6,
              times: [{ from: "09:00", to: "09:00" }]
            }
          }
        },
        expected: {
          "2016/12/23": {
            day: 4,
            times: [{ from: "13:00", to: "13:00" }]
          },
          "2016/12/24": {
            day: 5,
            times: [{ from: "14:00", to: "14:00" }]
          },
          "2016/12/25": {
            day: 6,
            times: [{ from: "09:00", to: "09:00" }]
          }
        }
      },
      {
        it: "should handle part day closures on an exhibition event",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_EXHIBITION,
            openingTimesClosures: [
              { date: "2016/12/24", from: "12:00", to: "12:30" },
              { date: "2016/12/24", from: "14:00", to: "15:00" },
              { date: "2016/12/24", from: "16:30", to: "17:00" }
            ]
          },
          dates: {
            "2016/12/23": {
              day: 4,
              times: [{ from: "13:00", to: "14:00" }]
            },
            "2016/12/24": {
              day: 5,
              times: [
                { from: "12:00", to: "13:00" },
                { from: "14:00", to: "15:00" },
                { from: "16:00", to: "17:00" }
              ]
            },
            "2016/12/25": {
              day: 6,
              times: [{ from: "09:00", to: "10:00" }]
            }
          }
        },
        expected: {
          "2016/12/23": {
            day: 4,
            times: [{ from: "13:00", to: "14:00" }]
          },
          "2016/12/24": {
            day: 5,
            times: [
              { from: "12:30", to: "13:00" },
              { from: "16:00", to: "16:30" }
            ]
          },
          "2016/12/25": {
            day: 6,
            times: [{ from: "09:00", to: "10:00" }]
          }
        }
      },
      {
        it:
          "should handle part day closures on an exhibition event that uses venue times",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_EXHIBITION,
            useVenueOpeningTimes: true,
            openingTimesClosures: [
              { date: "2016/12/24", from: "12:00", to: "12:30" },
              { date: "2016/12/24", from: "14:00", to: "15:00" },
              { date: "2016/12/24", from: "16:30", to: "17:00" }
            ],
            venue: {
              openingTimesClosures: [
                { date: "2016/12/23", from: "13:30", to: "16:00" }
              ]
            }
          },
          dates: {
            "2016/12/23": {
              day: 4,
              times: [{ from: "13:00", to: "14:00" }]
            },
            "2016/12/24": {
              day: 5,
              times: [
                { from: "12:00", to: "13:00" },
                { from: "14:00", to: "15:00" },
                { from: "16:00", to: "17:00" }
              ]
            },
            "2016/12/25": {
              day: 6,
              times: [{ from: "09:00", to: "10:00" }]
            }
          }
        },
        expected: {
          "2016/12/23": {
            day: 4,
            times: [{ from: "13:00", to: "13:30" }]
          },
          "2016/12/24": {
            day: 5,
            times: [
              { from: "12:30", to: "13:00" },
              { from: "16:00", to: "16:30" }
            ]
          },
          "2016/12/25": {
            day: 6,
            times: [{ from: "09:00", to: "10:00" }]
          }
        }
      }
    ];

    tests.forEach(test => {
      it(test.it, () => {
        const actual = search.removePartDayClosureDates(
          test.args.event,
          deepFreeze(test.args.dates)
        );

        expect(actual).toEqual(test.expected);
      });
    });
  });

  describe("addSpecialDatesTags", () => {
    const tests = [
      {
        it: "should handle no special dates on an exhibition event",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_EXHIBITION
          },
          dates: {
            "2016/12/23": { day: 4, times: [{ from: "12:00", to: "14:00" }] },
            "2016/12/24": { day: 5, times: [{ from: "12:00", to: "14:00" }] },
            "2016/12/25": { day: 6, times: [{ from: "12:00", to: "14:00" }] }
          }
        },
        expected: {
          "2016/12/23": { day: 4, times: [{ from: "12:00", to: "14:00" }] },
          "2016/12/24": { day: 5, times: [{ from: "12:00", to: "14:00" }] },
          "2016/12/25": { day: 6, times: [{ from: "12:00", to: "14:00" }] }
        }
      },
      {
        it: "should handle no special dates on a performance event",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_PERFORMANCE
          },
          dates: {
            "2016/12/23": { day: 4, times: [{ from: "12:00", to: "12:00" }] },
            "2016/12/24": { day: 5, times: [{ from: "12:00", to: "12:00" }] },
            "2016/12/25": { day: 6, times: [{ from: "12:00", to: "12:00" }] }
          }
        },
        expected: {
          "2016/12/23": { day: 4, times: [{ from: "12:00", to: "12:00" }] },
          "2016/12/24": { day: 5, times: [{ from: "12:00", to: "12:00" }] },
          "2016/12/25": { day: 6, times: [{ from: "12:00", to: "12:00" }] }
        }
      },
      {
        it: "should handle special dates on an exhibition event",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_EXHIBITION,
            specialOpeningTimes: [
              {
                date: "2016/12/24",
                from: "12:00",
                audienceTags: [{ id: "audience/families", label: "families" }]
              },
              {
                date: "2016/12/30",
                from: "12:00",
                audienceTags: [{ id: "audience/cats", label: "cats" }]
              }
            ]
          },
          dates: {
            "2016/12/23": { day: 4, times: [{ from: "12:00", to: "14:00" }] },
            "2016/12/24": { day: 5, times: [{ from: "12:00", to: "14:00" }] },
            "2016/12/25": { day: 6, times: [{ from: "12:00", to: "14:00" }] }
          }
        },
        expected: {
          "2016/12/23": { day: 4, times: [{ from: "12:00", to: "14:00" }] },
          "2016/12/24": {
            day: 5,
            times: [
              {
                from: "12:00",
                to: "14:00",
                tags: ["audience/families"]
              }
            ]
          },
          "2016/12/25": { day: 6, times: [{ from: "12:00", to: "14:00" }] }
        }
      },
      {
        it: "should handle special dates on a performance event",
        args: {
          event: {
            eventType: constants.EVENT_TYPE_PERFORMANCE,
            specialPerformances: [
              {
                date: "2016/12/24",
                at: "12:00",
                audienceTags: [{ id: "audience/families", label: "families" }]
              },
              {
                date: "2016/12/30",
                at: "12:00",
                audienceTags: [{ id: "audience/cats", label: "cats" }]
              }
            ]
          },
          dates: {
            "2016/12/23": { day: 4, times: [{ from: "12:00", to: "12:00" }] },
            "2016/12/24": { day: 5, times: [{ from: "12:00", to: "12:00" }] },
            "2016/12/25": { day: 6, times: [{ from: "12:00", to: "12:00" }] }
          }
        },
        expected: {
          "2016/12/23": { day: 4, times: [{ from: "12:00", to: "12:00" }] },
          "2016/12/24": {
            day: 5,
            times: [
              {
                from: "12:00",
                to: "12:00",
                tags: ["audience/families"]
              }
            ]
          },
          "2016/12/25": { day: 6, times: [{ from: "12:00", to: "12:00" }] }
        }
      }
    ];

    tests.forEach(test => {
      it(test.it, () => {
        const actual = search.addSpecialDatesTags(
          test.args.event,
          deepFreeze(test.args.dates)
        );

        expect(actual).toEqual(test.expected);
      });
    });
  });

  describe("convertDatesToList", () => {
    const tests = [
      {
        it: "should handle no dates",
        args: {
          dates: {}
        },
        expected: []
      },
      {
        it: "should handle dates",
        args: {
          dates: {
            "2016/12/24": {
              day: 4,
              times: [
                { from: "12:00", to: "14:00", tags: ["audience/families"] },
                { from: "16:00", to: "18:00" }
              ]
            },
            "2016/12/25": {
              day: 5,
              times: [{ from: "20:00", to: "22:00" }]
            }
          }
        },
        expected: [
          {
            date: "2016/12/24",
            from: "12:00",
            to: "14:00",
            tags: ["audience/families"]
          },
          { date: "2016/12/24", from: "16:00", to: "18:00" },
          { date: "2016/12/25", from: "20:00", to: "22:00" }
        ]
      }
    ];

    tests.forEach(test => {
      it(test.it, () => {
        const actual = search.convertDatesToList(deepFreeze(test.args.dates));

        expect(actual).toEqual(test.expected);
      });
    });
  });

  describe("mapMediumTagsToArtsType", () => {
    const tests = [
      {
        args: {
          mediumTags: null,
          eventType: "Performance"
        },
        expected: "Performing"
      },
      {
        args: {
          mediumTags: [],
          eventType: "Exhibition"
        },
        expected: "Visual"
      },
      {
        args: {
          mediumTags: [{ id: "medium/painting" }, { id: "medium/sculpture" }],
          eventType: "Performance"
        },
        expected: "Visual"
      },
      {
        args: {
          mediumTags: [{ id: "medium/literature" }],
          eventType: "Performance"
        },
        expected: "CreativeWriting"
      },
      {
        args: {
          mediumTags: [{ id: "medium/poetry" }],
          eventType: "Exhibition"
        },
        expected: "CreativeWriting"
      },
      {
        args: {
          mediumTags: [{ id: "medium/theatre" }, { id: "medium/sculpture" }],
          eventType: "Exhibition"
        },
        expected: "Visual" // should favour visual arts in this case
      }
    ];

    tests.forEach(test => {
      it(
        "should return " +
          JSON.stringify(test.expected) +
          " for args " +
          JSON.stringify(test.args),
        () => {
          const result = search.mapMediumTagsToArtsType(
            test.args.mediumTags,
            test.args.eventType
          );

          expect(result).toEqual(test.expected);
        }
      );
    });
  });

  describe("generateMediumWithStyleTags", () => {
    const tests = [
      {
        args: {
          mediumTags: [],
          styleTags: []
        },
        expected: []
      },
      {
        args: {
          mediumTags: [{ id: "medium/painting", label: "painting" }],
          styleTags: []
        },
        expected: []
      },
      {
        args: {
          mediumTags: [{ id: "medium/painting", label: "painting" }],
          styleTags: [{ id: "style/contemporary", label: "contemporary" }]
        },
        expected: [
          {
            id: "medium/painting/contemporary",
            label: "contemporary painting"
          }
        ]
      },
      {
        args: {
          mediumTags: [
            { id: "medium/painting", label: "painting" },
            { id: "medium/drawing", label: "drawing" }
          ],
          styleTags: [
            { id: "style/contemporary", label: "contemporary" },
            { id: "style/surreal", label: "surreal" }
          ]
        },
        expected: [
          {
            id: "medium/painting/contemporary",
            label: "contemporary painting"
          },
          {
            id: "medium/painting/surreal",
            label: "surreal painting"
          },
          {
            id: "medium/drawing/contemporary",
            label: "contemporary drawing"
          },
          {
            id: "medium/drawing/surreal",
            label: "surreal drawing"
          }
        ]
      }
    ];

    tests.forEach(test => {
      it(
        "should return " +
          JSON.stringify(test.expected) +
          " for args " +
          JSON.stringify(test.args),
        () => {
          const result = search.generateMediumWithStyleTags(
            test.args.mediumTags,
            test.args.styleTags
          );

          expect(result).toEqual(test.expected);
        }
      );
    });
  });

  describe("createSearchDateObjects", () => {
    describe("performance event", () => {
      const tests = [
        {
          it: "should handle no performances",
          args: {
            event: {
              eventType: "Performance",
              occurrenceType: "Bounded",
              dateFrom: "2016/12/20",
              dateTo: "2016/12/30",
              venue: {}
            },
            dateToday: "2016/12/01",
            dateMax: "2018/01/01"
          },
          expected: []
        },
        {
          it: "should handle a closure",
          args: {
            event: {
              eventType: "Performance",
              occurrenceType: "Bounded",
              dateFrom: "2016/12/20",
              dateTo: "2016/12/30",
              performances: [{ day: 6, at: "11:00" }],
              additionalPerformances: [{ date: "2016/12/25", at: "09:00" }],
              performancesClosures: [{ date: "2016/12/25" }],
              venue: {}
            },
            dateToday: "2016/12/01",
            dateMax: "2018/01/01"
          },
          expected: []
        },
        {
          it: "should handle additional performances",
          args: {
            event: {
              eventType: "Performance",
              occurrenceType: "Bounded",
              dateFrom: "2016/12/20",
              dateTo: "2016/12/30",
              performances: [{ day: 6, at: "11:00" }],
              additionalPerformances: [{ date: "2016/12/25", at: "09:00" }],
              venue: {}
            },
            dateToday: "2016/12/01",
            dateMax: "2018/01/01"
          },
          expected: [
            { date: "2016/12/25", from: "09:00", to: "09:00" },
            { date: "2016/12/25", from: "11:00", to: "11:00" }
          ]
        },
        {
          it: "should handle a sold out event",
          args: {
            event: {
              soldOut: true,
              eventType: "Performance",
              occurrenceType: "Bounded",
              dateFrom: "2016/12/20",
              dateTo: "2016/12/30",
              performances: [{ day: 6, at: "11:00" }],
              additionalPerformances: [{ date: "2016/12/25", at: "09:00" }],
              venue: {}
            },
            dateToday: "2016/12/01",
            dateMax: "2018/01/01"
          },
          expected: []
        },
        {
          it: "should handle a performance with a sold out performance",
          args: {
            event: {
              eventType: "Performance",
              occurrenceType: "Bounded",
              dateFrom: "2016/12/20",
              dateTo: "2016/12/30",
              performances: [{ day: 6, at: "11:00" }],
              additionalPerformances: [{ date: "2016/12/25", at: "09:00" }],
              venue: {},
              soldOutPerformances: [{ date: "2016/12/25", at: "09:00" }]
            },
            dateToday: "2016/12/01",
            dateMax: "2018/01/01"
          },
          expected: [{ date: "2016/12/25", from: "11:00", to: "11:00" }]
        },
        {
          it: "should handle closure with time that does not match",
          args: {
            event: {
              eventType: "Performance",
              occurrenceType: "Bounded",
              dateFrom: "2016/12/20",
              dateTo: "2016/12/30",
              performances: [{ day: 6, at: "11:00" }],
              additionalPerformances: [{ date: "2016/12/25", at: "09:00" }],
              performancesClosures: [{ date: "2016/12/25", at: "08:00" }],
              venue: {}
            },
            dateToday: "2016/12/01",
            dateMax: "2018/01/01"
          },
          expected: [
            { date: "2016/12/25", from: "09:00", to: "09:00" },
            { date: "2016/12/25", from: "11:00", to: "11:00" }
          ]
        },
        {
          it: "should handle closure with time that matches",
          args: {
            event: {
              eventType: "Performance",
              occurrenceType: "Bounded",
              dateFrom: "2016/12/20",
              dateTo: "2016/12/30",
              performances: [{ day: 6, at: "11:00" }],
              additionalPerformances: [{ date: "2016/12/25", at: "09:00" }],
              performancesClosures: [{ date: "2016/12/25", at: "09:00" }],
              venue: {}
            },
            dateToday: "2016/12/01",
            dateMax: "2018/01/01"
          },
          expected: [{ date: "2016/12/25", from: "11:00", to: "11:00" }]
        },
        {
          it: "should handle special performances that match",
          args: {
            event: {
              eventType: "Performance",
              occurrenceType: "Bounded",
              dateFrom: "2016/12/20",
              dateTo: "2016/12/30",
              performances: [{ day: 6, at: "09:00" }],
              specialPerformances: [
                {
                  date: "2016/12/25",
                  at: "09:00",
                  audienceTags: [
                    { id: "audience/family", label: "family" },
                    { id: "audience/baby", label: "baby" }
                  ]
                }
              ],
              venue: {}
            },
            dateToday: "2016/12/01",
            dateMax: "2018/01/01"
          },
          expected: [
            {
              date: "2016/12/25",
              from: "09:00",
              to: "09:00",
              tags: ["audience/family", "audience/baby"]
            }
          ]
        },
        {
          it: "should handle special performances that do not match",
          args: {
            event: {
              eventType: "Performance",
              occurrenceType: "Bounded",
              dateFrom: "2016/12/20",
              dateTo: "2016/12/30",
              performances: [{ day: 6, at: "09:00" }],
              specialPerformances: [
                {
                  date: "2016/12/25",
                  at: "11:00",
                  audienceTags: [
                    { id: "audience/family", label: "family" },
                    { id: "audience/baby", label: "baby" }
                  ]
                }
              ],
              venue: {}
            },
            dateToday: "2016/12/01",
            dateMax: "2018/01/01"
          },
          expected: [{ date: "2016/12/25", from: "09:00", to: "09:00" }]
        },
        {
          it:
            "should handle special performances that match both performances and additional performances",
          args: {
            event: {
              eventType: "Performance",
              occurrenceType: "Bounded",
              dateFrom: "2016/12/20",
              dateTo: "2016/12/30",
              performances: [{ day: 6, at: "11:00" }],
              additionalPerformances: [{ date: "2016/12/25", at: "09:00" }],
              specialPerformances: [
                {
                  date: "2016/12/25",
                  at: "09:00",
                  audienceTags: [
                    { id: "audience/family", label: "family" },
                    { id: "audience/baby", label: "baby" }
                  ]
                },
                {
                  date: "2016/12/25",
                  at: "11:00",
                  audienceTags: [
                    { id: "audience/teenagers", label: "teenagers" }
                  ]
                }
              ],
              venue: {}
            },
            dateToday: "2016/12/01",
            dateMax: "2018/01/01"
          },
          expected: [
            {
              date: "2016/12/25",
              from: "09:00",
              to: "09:00",
              tags: ["audience/family", "audience/baby"]
            },
            {
              date: "2016/12/25",
              from: "11:00",
              to: "11:00",
              tags: ["audience/teenagers"]
            }
          ]
        },
        {
          it: "should handle simple performances",
          args: {
            event: {
              eventType: "Performance",
              occurrenceType: "Bounded",
              dateFrom: "2016/12/20",
              dateTo: "2016/12/30",
              performances: [{ day: 6, at: "11:00" }],
              venue: {}
            },
            dateToday: "2016/12/01",
            dateMax: "2018/01/01"
          },
          expected: [{ date: "2016/12/25", from: "11:00", to: "11:00" }]
        },
        {
          it: "should handle complete replacement of performances on a day",
          args: {
            event: {
              eventType: "Performance",
              occurrenceType: "Bounded",
              dateFrom: "2016/12/20",
              dateTo: "2016/12/30",
              performances: [{ day: 4, at: "11:00" }, { day: 4, at: "12:00" }],
              additionalPerformances: [
                { date: "2016/12/25", at: "09:00" },
                { date: "2016/12/30", at: "13:00" }
              ],
              performancesClosures: [
                { date: "2016/12/30", at: "11:00" },
                { date: "2016/12/30", at: "12:00" }
              ],
              venue: {}
            },
            dateToday: "2016/12/01",
            dateMax: "2018/01/01"
          },
          expected: [
            { date: "2016/12/23", from: "11:00", to: "11:00" },
            { date: "2016/12/23", from: "12:00", to: "12:00" },
            { date: "2016/12/25", from: "09:00", to: "09:00" },
            { date: "2016/12/30", from: "13:00", to: "13:00" }
          ]
        }
      ];

      tests.forEach(test => {
        it(test.it, () => {
          const result = search.createSearchDateObjects(
            test.args.event,
            test.args.dateToday,
            test.args.dateMax,
            {}
          );

          expect(result).toEqual(test.expected);
        });
      });
    });

    describe("exhibition event that does not use venue opening times", () => {
      const tests = [
        {
          it: "should handle no opening times",
          args: {
            event: {
              eventType: "Exhibition",
              occurrenceType: "Bounded",
              dateFrom: "2016/12/20",
              dateTo: "2016/12/30",
              openingTimesClosures: [{ date: "2016/12/21" }],
              venue: {}
            },
            dateToday: "2016/12/01",
            dateMax: "2018/01/01"
          },
          expected: []
        },
        {
          it: "should handle closure for additional opening time",
          args: {
            event: {
              eventType: "Exhibition",
              occurrenceType: "Bounded",
              dateFrom: "2016/12/20",
              dateTo: "2016/12/30",
              useVenueOpeningTimes: false,
              openingTimes: [],
              additionalOpeningTimes: [
                { date: "2016/12/21", from: "08:00", to: "16:00" }
              ],
              openingTimesClosures: [{ date: "2016/12/21" }],
              venue: {}
            },
            dateToday: "2016/12/01",
            dateMax: "2018/01/01"
          },
          expected: []
        },
        {
          it: "should handle additional opening times",
          args: {
            event: {
              eventType: "Exhibition",
              occurrenceType: "Bounded",
              dateFrom: "2016/12/20",
              dateTo: "2016/12/30",
              useVenueOpeningTimes: false,
              openingTimes: [],
              additionalOpeningTimes: [
                { date: "2016/12/21", from: "08:00", to: "16:00" }
              ],
              openingTimesClosures: [{ date: "2016/12/26" }],
              venue: {}
            },
            dateToday: "2016/12/01",
            dateMax: "2018/01/01"
          },
          expected: [{ date: "2016/12/21", from: "08:00", to: "16:00" }]
        },
        {
          it: "should handle opening times being before date range",
          args: {
            event: {
              eventType: "Exhibition",
              occurrenceType: "Bounded",
              dateFrom: "2016/12/20",
              dateTo: "2016/12/30",
              useVenueOpeningTimes: false,
              openingTimes: [],
              additionalOpeningTimes: [
                { date: "2016/12/21", from: "08:00", to: "16:00" }
              ],
              openingTimesClosures: [],
              venue: {}
            },
            dateToday: "2016/12/30",
            dateMax: "2018/01/01"
          },
          expected: []
        },
        {
          it: "should handle opening times being after date range",
          args: {
            event: {
              eventType: "Exhibition",
              occurrenceType: "Bounded",
              dateFrom: "2016/12/20",
              dateTo: "2016/12/30",
              useVenueOpeningTimes: false,
              openingTimes: [],
              additionalOpeningTimes: [
                { date: "2016/12/21", from: "08:00", to: "16:00" }
              ],
              openingTimesClosures: [],
              venue: {}
            },
            dateToday: "2016/12/01",
            dateMax: "2016/12/05"
          },
          expected: []
        },
        {
          it: "should handle opening times with additions",
          args: {
            event: {
              eventType: "Exhibition",
              occurrenceType: "Bounded",
              dateFrom: "2016/12/20", // day 1
              dateTo: "2016/12/30",
              useVenueOpeningTimes: false,
              openingTimes: [
                { day: 0, from: "09:00", to: "10:00" },
                { day: 0, from: "11:00", to: "12:00" },
                { day: 1, from: "11:00", to: "12:00" }
              ],
              additionalOpeningTimes: [
                { date: "2016/12/20", from: "15:00", to: "16:00" }
              ],
              venue: {}
            },
            dateToday: "2016/12/01",
            dateMax: "2018/01/01"
          },
          expected: [
            { date: "2016/12/20", from: "11:00", to: "12:00" },
            { date: "2016/12/20", from: "15:00", to: "16:00" },
            { date: "2016/12/26", from: "09:00", to: "10:00" },
            { date: "2016/12/26", from: "11:00", to: "12:00" },
            { date: "2016/12/27", from: "11:00", to: "12:00" }
          ]
        },
        {
          it: "should handle opening times with additions and a closure",
          args: {
            event: {
              eventType: "Exhibition",
              occurrenceType: "Bounded",
              dateFrom: "2016/12/20", // day 1
              dateTo: "2016/12/30",
              useVenueOpeningTimes: false,
              openingTimes: [
                { day: 0, from: "09:00", to: "10:00" },
                { day: 0, from: "11:00", to: "12:00" },
                { day: 1, from: "11:00", to: "12:00" },
                { day: 1, from: "14:00", to: "15:00" }
              ],
              additionalOpeningTimes: [
                { date: "2016/12/20", from: "15:30", to: "16:00" }
              ],
              openingTimesClosures: [{ date: "2016/12/26" }],
              venue: {}
            },
            dateToday: "2016/12/01",
            dateMax: "2018/01/01"
          },
          expected: [
            { date: "2016/12/20", from: "11:00", to: "12:00" },
            { date: "2016/12/20", from: "14:00", to: "15:00" },
            { date: "2016/12/20", from: "15:30", to: "16:00" },
            { date: "2016/12/27", from: "11:00", to: "12:00" },
            { date: "2016/12/27", from: "14:00", to: "15:00" }
          ]
        },
        {
          it:
            "should handle opening times with a time closure before the regular times",
          args: {
            event: {
              eventType: "Exhibition",
              occurrenceType: "Bounded",
              dateFrom: "2016/12/20", // day 1
              dateTo: "2016/12/30",
              useVenueOpeningTimes: false,
              additionalOpeningTimes: [
                { date: "2016/12/26", from: "12:00", to: "16:00" }
              ],
              openingTimesClosures: [
                { date: "2016/12/26", from: "11:00", to: "14:00" }
              ],
              venue: {}
            },
            dateToday: "2016/12/01",
            dateMax: "2018/01/01"
          },
          expected: [{ date: "2016/12/26", from: "14:00", to: "16:00" }]
        },
        {
          it:
            "should handle opening times with a time closure after the regular times",
          args: {
            event: {
              eventType: "Exhibition",
              occurrenceType: "Bounded",
              dateFrom: "2016/12/20", // day 1
              dateTo: "2016/12/30",
              useVenueOpeningTimes: false,
              additionalOpeningTimes: [
                { date: "2016/12/26", from: "12:00", to: "16:00" }
              ],
              openingTimesClosures: [
                { date: "2016/12/26", from: "15:00", to: "16:00" }
              ],
              venue: {}
            },
            dateToday: "2016/12/01",
            dateMax: "2018/01/01"
          },
          expected: [{ date: "2016/12/26", from: "12:00", to: "15:00" }]
        }
      ];

      tests.forEach(test => {
        it(test.it, () => {
          const result = search.createSearchDateObjects(
            test.args.event,
            test.args.dateToday,
            test.args.dateMax,
            {}
          );

          expect(result).toEqual(test.expected);
        });
      });
    });

    describe("exhibition event that uses venue opening times", () => {
      const tests = [
        {
          it: "should ignore event opening times",
          args: {
            event: {
              eventType: "Exhibition",
              occurrenceType: "Bounded",
              dateFrom: "2016/12/20", // day 1
              dateTo: "2016/12/30",
              useVenueOpeningTimes: true,
              openingTimes: [
                { day: 0, from: "09:00", to: "10:00" },
                { day: 0, from: "11:00", to: "12:00" },
                { day: 1, from: "11:00", to: "12:00" }
              ],
              additionalOpeningTimes: [
                { date: "2016/12/20", from: "14:00", to: "16:00" }
              ],
              openingTimesClosures: [],
              venue: {}
            },
            dateToday: "2016/12/01",
            dateMax: "2018/01/01"
          },
          expected: [{ date: "2016/12/20", from: "14:00", to: "16:00" }]
        },
        {
          it:
            "should apply venue opening times and duplicate additions at both venue and event levels",
          args: {
            event: {
              eventType: "Exhibition",
              occurrenceType: "Bounded",
              dateFrom: "2016/12/20", // day 1
              dateTo: "2016/12/30",
              useVenueOpeningTimes: true,
              additionalOpeningTimes: [
                { date: "2016/12/20", from: "14:00", to: "16:00" }
              ],
              closures: [],
              venue: {
                openingTimes: [
                  { day: 0, from: "09:00", to: "10:00" },
                  { day: 1, from: "11:00", to: "12:00" }
                ],
                additionalOpeningTimes: [
                  { date: "2016/12/20", from: "14:00", to: "16:00" }
                ]
              }
            },
            dateToday: "2016/12/01",
            dateMax: "2018/01/01"
          },
          expected: [
            { date: "2016/12/20", from: "11:00", to: "12:00" },
            { date: "2016/12/20", from: "14:00", to: "16:00" },
            { date: "2016/12/26", from: "09:00", to: "10:00" },
            { date: "2016/12/27", from: "11:00", to: "12:00" }
          ]
        },
        {
          it:
            "should apply venue opening times and non-duplicate additions at both venue and event levels",
          args: {
            event: {
              eventType: "Exhibition",
              occurrenceType: "Bounded",
              dateFrom: "2016/12/20", // day 1
              dateTo: "2016/12/30",
              useVenueOpeningTimes: true,
              additionalOpeningTimes: [
                { date: "2016/12/20", from: "14:00", to: "16:00" }
              ],
              closures: [],
              venue: {
                openingTimes: [
                  { day: 0, from: "09:00", to: "10:00" },
                  { day: 1, from: "11:00", to: "12:00" }
                ],
                additionalOpeningTimes: [
                  { date: "2016/12/20", from: "18:00", to: "20:00" }
                ]
              }
            },
            dateToday: "2016/12/01",
            dateMax: "2018/01/01"
          },
          expected: [
            { date: "2016/12/20", from: "11:00", to: "12:00" },
            { date: "2016/12/20", from: "14:00", to: "16:00" },
            { date: "2016/12/20", from: "18:00", to: "20:00" },
            { date: "2016/12/26", from: "09:00", to: "10:00" },
            { date: "2016/12/27", from: "11:00", to: "12:00" }
          ]
        },
        {
          it: "should apply venue closures to block venue opening times times",
          args: {
            event: {
              eventType: "Exhibition",
              occurrenceType: "Bounded",
              dateFrom: "2016/12/20", // day 1
              dateTo: "2016/12/28",
              useVenueOpeningTimes: true,
              venue: {
                openingTimes: [
                  { day: 6, from: "09:00", to: "10:00" },
                  { day: 6, from: "11:00", to: "12:00" },
                  { day: 5, from: "11:00", to: "12:00" }
                ],
                openingTimesClosures: [{ date: "2016/12/24" }]
              }
            },
            dateToday: "2016/12/01",
            dateMax: "2018/01/01"
          },
          expected: [
            { date: "2016/12/25", from: "09:00", to: "10:00" },
            { date: "2016/12/25", from: "11:00", to: "12:00" }
          ]
        },
        {
          it: "should apply named closures to block venue opening times",
          args: {
            event: {
              eventType: "Exhibition",
              occurrenceType: "Bounded",
              dateFrom: "2016/12/20", // day 1
              dateTo: "2016/12/28",
              useVenueOpeningTimes: true,
              venue: {
                openingTimes: [{ day: 7, from: "20:00", to: "21:00" }],
                namedClosures: ["BoxingDay"]
              }
            },
            dateToday: "2016/12/01",
            dateMax: "2018/01/01"
          },
          expected: []
        }
      ];

      tests.forEach(test => {
        it(test.it, () => {
          const result = search.createSearchDateObjects(
            test.args.event,
            test.args.dateToday,
            test.args.dateMax,
            {
              BoxingDay: {
                "2016": ["2016/12/26"],
                "2017": ["2017/12/26"]
              }
            }
          );

          expect(result).toEqual(test.expected);
        });
      });
    });
  });
});
