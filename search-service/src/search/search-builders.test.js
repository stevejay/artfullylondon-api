"use strict";

const moment = require("moment-timezone");
const MultiSearchBuilder = require("es-search-builder").MultiSearchBuilder;
const searchBuilders = require("./search-builders");
const time = require("./time");
const constants = require("../constants");

describe("search-builders", () => {
  describe("buildTalentRelatedEventsSearchPreset", () => {
    it("should build a correct search", () => {
      time.getLondonNow = jest
        .fn()
        .mockReturnValue(new moment("2017/06/25", "YYYY/MM/DD"));

      const msearchBuilder = new MultiSearchBuilder();

      searchBuilders.buildTalentRelatedEventsSearchPreset(
        msearchBuilder,
        "talent-1"
      );

      const result = msearchBuilder.build();

      expect(result).toEqual([
        { index: constants.SEARCH_INDEX_TYPE_EVENT_FULL, type: "doc" },
        {
          _source: [
            "entityType",
            "id",
            "status",
            "name",
            "eventType",
            "occurrenceType",
            "costType",
            "summary",
            "venueId",
            "venueName",
            "postcode",
            "latitude",
            "longitude",
            "dateFrom",
            "dateTo",
            "image",
            "imageCopyright",
            "imageRatio",
            "imageColor"
          ],
          query: {
            bool: {
              filter: [
                {
                  term: {
                    status: "Active"
                  }
                },
                {
                  nested: {
                    path: "dates",
                    query: {
                      bool: {
                        filter: [
                          {
                            range: {
                              "dates.date": { gte: "2017/06/25" }
                            }
                          },
                          {
                            range: {
                              "dates.date": { lte: "2018/06/26" }
                            }
                          }
                        ]
                      }
                    }
                  }
                },
                {
                  term: {
                    talents: "talent-1"
                  }
                }
              ]
            }
          },
          from: 0,
          size: 300,
          sort: [
            {
              _score: {
                order: "desc"
              }
            },
            {
              name_sort: {
                order: "asc"
              }
            }
          ]
        }
      ]);
    });
  });

  describe("buildVenueRelatedEventsSearchPreset", () => {
    it("should build a correct search", () => {
      time.getLondonNow = jest
        .fn()
        .mockReturnValue(new moment("2017/06/25", "YYYY/MM/DD"));

      const msearchBuilder = new MultiSearchBuilder();

      searchBuilders.buildVenueRelatedEventsSearchPreset(
        msearchBuilder,
        "venue-1"
      );

      const result = msearchBuilder.build();

      expect(result).toEqual([
        { index: constants.SEARCH_INDEX_TYPE_EVENT_FULL, type: "doc" },
        {
          _source: [
            "entityType",
            "id",
            "status",
            "name",
            "eventType",
            "occurrenceType",
            "costType",
            "summary",
            "venueId",
            "venueName",
            "postcode",
            "latitude",
            "longitude",
            "dateFrom",
            "dateTo",
            "image",
            "imageCopyright",
            "imageRatio",
            "imageColor"
          ],
          query: {
            bool: {
              filter: [
                {
                  term: {
                    status: "Active"
                  }
                },
                {
                  nested: {
                    path: "dates",
                    query: {
                      bool: {
                        filter: [
                          {
                            range: {
                              "dates.date": { gte: "2017/06/25" }
                            }
                          },
                          {
                            range: {
                              "dates.date": { lte: "2018/06/26" }
                            }
                          }
                        ]
                      }
                    }
                  }
                },
                {
                  term: {
                    venueId: "venue-1"
                  }
                }
              ]
            }
          },
          from: 0,
          size: 300,
          sort: [
            {
              _score: {
                order: "desc"
              }
            },
            {
              name_sort: {
                order: "asc"
              }
            }
          ]
        }
      ]);
    });
  });

  describe("buildEventSeriesRelatedEventsSearchPreset", () => {
    it("should build a correct search", () => {
      time.getLondonNow = jest
        .fn()
        .mockReturnValue(new moment("2017/06/25", "YYYY/MM/DD"));

      const msearchBuilder = new MultiSearchBuilder();

      searchBuilders.buildEventSeriesRelatedEventsSearchPreset(
        msearchBuilder,
        "event-series-1"
      );

      const result = msearchBuilder.build();

      expect(result).toEqual([
        { index: constants.SEARCH_INDEX_TYPE_EVENT_FULL, type: "doc" },
        {
          _source: [
            "entityType",
            "id",
            "status",
            "name",
            "eventType",
            "occurrenceType",
            "costType",
            "summary",
            "venueId",
            "venueName",
            "postcode",
            "latitude",
            "longitude",
            "dateFrom",
            "dateTo",
            "image",
            "imageCopyright",
            "imageRatio",
            "imageColor"
          ],
          query: {
            bool: {
              filter: [
                {
                  term: {
                    status: "Active"
                  }
                },
                {
                  nested: {
                    path: "dates",
                    query: {
                      bool: {
                        filter: [
                          {
                            range: {
                              "dates.date": { gte: "2017/06/25" }
                            }
                          },
                          {
                            range: {
                              "dates.date": { lte: "2018/06/26" }
                            }
                          }
                        ]
                      }
                    }
                  }
                },
                {
                  term: {
                    eventSeriesId: "event-series-1"
                  }
                }
              ]
            }
          },
          from: 0,
          size: 300,
          sort: [
            {
              _score: {
                order: "desc"
              }
            },
            {
              name_sort: {
                order: "asc"
              }
            }
          ]
        }
      ]);
    });
  });

  describe("buildEntityCountsSearchPreset", () => {
    it("should build an entity counts search", () => {
      const msearchBuilder = new MultiSearchBuilder();
      searchBuilders.buildEntityCountsSearchPreset(msearchBuilder);

      const result = msearchBuilder.build();

      expect(result).toEqual([
        { index: constants.SEARCH_INDEX_TYPE_EVENT_FULL, type: "doc" },
        { size: 0 },
        {
          index: constants.SEARCH_INDEX_TYPE_EVENT_SERIES_FULL,
          type: "doc"
        },
        { size: 0 },
        { index: constants.SEARCH_INDEX_TYPE_TALENT_FULL, type: "doc" },
        { size: 0 },
        { index: constants.SEARCH_INDEX_TYPE_VENUE_FULL, type: "doc" },
        { size: 0 }
      ]);
    });
  });

  describe("buildByExternalEventIdPreset", () => {
    it("should build a by homepage search", () => {
      const msearchBuilder = new MultiSearchBuilder();

      // alan-cristea-gallery%2F2017%2Fgillian-ayres-paintings-and-woodcuts

      searchBuilders.buildByExternalEventIdPreset(
        msearchBuilder,
        "almeida-theatre|/a,almeida-theatre|/b"
      );

      const result = msearchBuilder.build();

      expect(result).toEqual([
        { index: constants.SEARCH_INDEX_TYPE_EVENT_FULL, type: "doc" },
        {
          size: 1000,
          _source: ["externalEventId", "id"],
          query: {
            bool: {
              filter: [
                {
                  terms: {
                    externalEventId: [
                      "almeida-theatre|/a",
                      "almeida-theatre|/b"
                    ]
                  }
                }
              ]
            }
          }
        }
      ]);
    });
  });

  describe("buildFeaturedEventsSearchPreset", () => {
    it("should build a featured events search", () => {
      time.getLondonNow = jest
        .fn()
        .mockReturnValue(new moment("2017/01/16", "YYYY/MM/DD"));

      const msearchBuilder = new MultiSearchBuilder();
      searchBuilders.buildFeaturedEventsSearchPreset(msearchBuilder);

      const result = msearchBuilder.build();

      expect(result).toEqual([
        { index: constants.SEARCH_INDEX_TYPE_EVENT_FULL, type: "doc" },
        {
          from: 0,
          size: 24,
          _source: constants.SUMMARY_EVENT_SOURCE_FIELDS,
          sort: [
            { _score: { order: "desc" } },
            { name_sort: { order: "asc" } }
          ],
          query: {
            bool: {
              filter: [
                { term: { status: "Active" } },
                { term: { area: "Central" } },
                {
                  nested: {
                    path: "dates",
                    query: {
                      bool: {
                        filter: [
                          {
                            range: { "dates.date": { gte: "2017/01/16" } }
                          },
                          {
                            range: { "dates.date": { lte: "2017/01/30" } }
                          }
                        ]
                      }
                    }
                  }
                }
              ]
            }
          }
        }
      ]);
    });
  });

  describe("createPublicEventSearchParamsFromRequest", function() {
    const tests = [
      {
        arg: { term: "Almeida" },
        expected: { term: "Almeida" }
      },
      {
        arg: { timeFrom: "20:00" },
        expected: { timeFrom: "20:00" }
      },
      {
        arg: { timeTo: "13:20" },
        expected: { timeTo: "13:20" }
      },
      {
        arg: { area: "North" },
        expected: { area: "North" }
      },
      {
        arg: { location: { north: 54, west: 1, south: 50, east: 3 } },
        expected: { location: { north: 54, west: 1, south: 50, east: 3 } }
      },
      {
        arg: { medium: "medium/painting" },
        expected: { tags: ["medium/painting"] }
      },
      {
        arg: { medium: "medium/painting", style: "style/contemporary" },
        expected: { tags: ["medium/painting/contemporary"] }
      },
      {
        arg: { medium: ":all-visual" },
        expected: { artsType: "Visual" }
      },
      {
        arg: { medium: ":all-performing" },
        expected: { artsType: "Performing" }
      },
      {
        arg: { medium: ":all-creative-writing" },
        expected: { artsType: "CreativeWriting" }
      },
      {
        arg: { audience: "audience/families" },
        expected: { audience: "audience/families" }
      },
      {
        arg: { cost: "Free" },
        expected: { costType: "Free" }
      },
      {
        arg: { booking: "NotRequired" },
        expected: { bookingType: "NotRequired" }
      },
      {
        arg: { venueId: "almeida-theatre" },
        expected: { venueId: "almeida-theatre" }
      },
      {
        arg: { talentId: "some-guy" },
        expected: { talentId: "some-guy" }
      },
      {
        arg: { skip: 24 },
        expected: { skip: 24 }
      },
      {
        arg: { take: 12 },
        expected: { take: 12 }
      },
      {
        arg: { dateFrom: "2016/11/14" },
        expected: { dateFrom: "2016/11/14" }
      },
      {
        arg: { dateTo: "2016/11/18" },
        expected: { dateTo: "2016/11/18" }
      }
    ];

    tests.map(test => {
      it(`should return ${JSON.stringify(
        test.expected
      )} when passed ${JSON.stringify(test.arg)}`, function() {
        const result = searchBuilders.createPublicEventSearchParamsFromRequest(
          test.arg
        );
        expect(result).toEqual(test.expected);
      });
    });
  });

  describe("buildPublicEventSearch", function() {
    const source = constants.SUMMARY_EVENT_SOURCE_FIELDS;

    it("should build a search for only active events from a request with no params", function() {
      const request = {
        skip: 0,
        take: 12
      };

      const msearchBuilder = new MultiSearchBuilder();
      searchBuilders.buildPublicEventSearch(msearchBuilder, request);

      const result = msearchBuilder.build();

      expect(result).toEqual([
        { index: constants.SEARCH_INDEX_TYPE_EVENT_FULL, type: "doc" },
        {
          size: 12,
          from: 0,
          _source: source,
          sort: [
            { _score: { order: "desc" } },
            { name_sort: { order: "asc" } }
          ],
          query: {
            bool: {
              filter: [
                {
                  term: {
                    status: "Active"
                  }
                }
              ]
            }
          }
        }
      ]);
    });

    it("should build a search from a request with a location", function() {
      const request = {
        skip: 0,
        take: 10,
        location: {
          north: 54,
          west: 1,
          south: 50,
          east: 3
        }
      };

      const msearchBuilder = new MultiSearchBuilder();
      searchBuilders.buildPublicEventSearch(msearchBuilder, request);

      const result = msearchBuilder.build();

      expect(result).toEqual([
        { index: constants.SEARCH_INDEX_TYPE_EVENT_FULL, type: "doc" },
        {
          size: 10,
          from: 0,
          _source: source,
          sort: [
            { _score: { order: "desc" } },
            { name_sort: { order: "asc" } }
          ],
          query: {
            bool: {
              filter: [
                {
                  term: {
                    status: "Active"
                  }
                },
                {
                  geo_bounding_box: {
                    type: "indexed",
                    locationOptimized: {
                      top_left: {
                        lat: 54,
                        lon: 1
                      },
                      bottom_right: {
                        lat: 50,
                        lon: 3
                      }
                    }
                  }
                }
              ]
            }
          }
        }
      ]);
    });

    it("should build a search from params with a booking type", function() {
      const request = {
        skip: 0,
        take: 10,
        bookingType: "NotRequired"
      };

      const msearchBuilder = new MultiSearchBuilder();
      searchBuilders.buildPublicEventSearch(msearchBuilder, request);

      const result = msearchBuilder.build();

      expect(result).toEqual([
        { index: constants.SEARCH_INDEX_TYPE_EVENT_FULL, type: "doc" },
        {
          size: 10,
          from: 0,
          _source: source,
          sort: [
            { _score: { order: "desc" } },
            { name_sort: { order: "asc" } }
          ],
          query: {
            bool: {
              filter: [
                {
                  term: {
                    status: "Active"
                  }
                },
                {
                  term: {
                    bookingType: "NotRequired"
                  }
                }
              ]
            }
          }
        }
      ]);
    });

    it("should build a search from params with a cost type", function() {
      const request = {
        skip: 0,
        take: 10,
        costType: "Free"
      };

      const msearchBuilder = new MultiSearchBuilder();
      searchBuilders.buildPublicEventSearch(msearchBuilder, request);

      const result = msearchBuilder.build();

      expect(result).toEqual([
        { index: constants.SEARCH_INDEX_TYPE_EVENT_FULL, type: "doc" },
        {
          size: 10,
          from: 0,
          _source: source,
          sort: [
            { _score: { order: "desc" } },
            { name_sort: { order: "asc" } }
          ],
          query: {
            bool: {
              filter: [
                {
                  term: {
                    status: "Active"
                  }
                },
                {
                  term: {
                    costType: "Free"
                  }
                }
              ]
            }
          }
        }
      ]);
    });

    it("should build a search from params with an area", function() {
      const request = {
        skip: 0,
        take: 10,
        area: "Central"
      };

      const msearchBuilder = new MultiSearchBuilder();
      searchBuilders.buildPublicEventSearch(msearchBuilder, request);

      const result = msearchBuilder.build();

      expect(result).toEqual([
        { index: constants.SEARCH_INDEX_TYPE_EVENT_FULL, type: "doc" },
        {
          size: 10,
          from: 0,
          _source: source,
          sort: [
            { _score: { order: "desc" } },
            { name_sort: { order: "asc" } }
          ],
          query: {
            bool: {
              filter: [
                {
                  term: {
                    status: "Active"
                  }
                },
                {
                  term: {
                    area: "Central"
                  }
                }
              ]
            }
          }
        }
      ]);
    });

    it("should build a search from params with an arts type", function() {
      const request = {
        skip: 0,
        take: 10,
        artsType: "Performing"
      };

      const msearchBuilder = new MultiSearchBuilder();
      searchBuilders.buildPublicEventSearch(msearchBuilder, request);

      const result = msearchBuilder.build();

      expect(result).toEqual([
        { index: constants.SEARCH_INDEX_TYPE_EVENT_FULL, type: "doc" },
        {
          size: 10,
          from: 0,
          _source: source,
          sort: [
            { _score: { order: "desc" } },
            { name_sort: { order: "asc" } }
          ],
          query: {
            bool: {
              filter: [
                {
                  term: {
                    status: "Active"
                  }
                },
                {
                  term: {
                    artsType: "Performing"
                  }
                }
              ]
            }
          }
        }
      ]);
    });

    it("should build a search from params with tags", function() {
      const request = {
        skip: 0,
        take: 10,
        tags: ["medium/painting/surreal", "medium/sculpture/surreal"]
      };

      const msearchBuilder = new MultiSearchBuilder();
      searchBuilders.buildPublicEventSearch(msearchBuilder, request);

      const result = msearchBuilder.build();

      expect(result).toEqual([
        { index: constants.SEARCH_INDEX_TYPE_EVENT_FULL, type: "doc" },
        {
          size: 10,
          from: 0,
          _source: source,
          sort: [
            { _score: { order: "desc" } },
            { name_sort: { order: "asc" } }
          ],
          query: {
            bool: {
              filter: [
                {
                  term: { status: "Active" }
                },
                {
                  term: { tags: "medium/painting/surreal" }
                },
                {
                  term: { tags: "medium/sculpture/surreal" }
                }
              ]
            }
          }
        }
      ]);
    });

    it("should build a search from params with an audience tag", function() {
      const request = {
        skip: 0,
        take: 10,
        audience: "audience/families"
      };

      const msearchBuilder = new MultiSearchBuilder();
      searchBuilders.buildPublicEventSearch(msearchBuilder, request);

      const result = msearchBuilder.build();

      expect(result).toEqual([
        { index: constants.SEARCH_INDEX_TYPE_EVENT_FULL, type: "doc" },
        {
          size: 10,
          from: 0,
          _source: source,
          sort: [
            { _score: { order: "desc" } },
            { name_sort: { order: "asc" } }
          ],
          query: {
            bool: {
              filter: [
                {
                  term: { status: "Active" }
                },
                {
                  query: {
                    bool: {
                      minimum_should_match: 1,
                      should: [
                        {
                          term: { tags: "audience/families" }
                        },
                        {
                          nested: {
                            path: "dates",
                            query: {
                              bool: {
                                filter: [
                                  {
                                    term: { "dates.tags": "audience/families" }
                                  }
                                ]
                              }
                            }
                          }
                        }
                      ]
                    }
                  }
                }
              ]
            }
          }
        }
      ]);
    });

    it("should build a search from params with a talentId", function() {
      const request = {
        skip: 0,
        take: 10,
        talentId: "some-talent"
      };

      const msearchBuilder = new MultiSearchBuilder();
      searchBuilders.buildPublicEventSearch(msearchBuilder, request);

      const result = msearchBuilder.build();

      expect(result).toEqual([
        { index: constants.SEARCH_INDEX_TYPE_EVENT_FULL, type: "doc" },
        {
          size: 10,
          from: 0,
          _source: source,
          sort: [
            { _score: { order: "desc" } },
            { name_sort: { order: "asc" } }
          ],
          query: {
            bool: {
              filter: [
                {
                  term: {
                    status: "Active"
                  }
                },
                {
                  term: {
                    talents: "some-talent"
                  }
                }
              ]
            }
          }
        }
      ]);
    });

    it("should build a search from params with a venueId", function() {
      const request = {
        skip: 0,
        take: 10,
        venueId: "some-venue"
      };

      const msearchBuilder = new MultiSearchBuilder();
      searchBuilders.buildPublicEventSearch(msearchBuilder, request);

      const result = msearchBuilder.build();

      expect(result).toEqual([
        { index: constants.SEARCH_INDEX_TYPE_EVENT_FULL, type: "doc" },
        {
          size: 10,
          from: 0,
          _source: source,
          sort: [
            { _score: { order: "desc" } },
            { name_sort: { order: "asc" } }
          ],
          query: {
            bool: {
              filter: [
                {
                  term: {
                    status: "Active"
                  }
                },
                {
                  term: {
                    venueId: "some-venue"
                  }
                }
              ]
            }
          }
        }
      ]);
    });

    it("should build a search from params with a term", function() {
      const request = {
        skip: 0,
        take: 10,
        term: "Foo Bar"
      };

      const msearchBuilder = new MultiSearchBuilder();
      searchBuilders.buildPublicEventSearch(msearchBuilder, request);

      const result = msearchBuilder.build();

      expect(result).toEqual([
        { index: constants.SEARCH_INDEX_TYPE_EVENT_FULL, type: "doc" },
        {
          size: 10,
          from: 0,
          _source: source,
          sort: [
            { _score: { order: "desc" } },
            { name_sort: { order: "asc" } }
          ],
          query: {
            bool: {
              minimum_should_match: 1,
              filter: [
                {
                  term: {
                    status: "Active"
                  }
                }
              ],
              should: [
                {
                  match: {
                    name: "Foo Bar"
                  }
                },
                {
                  match: {
                    venueName: "Foo Bar"
                  }
                },
                {
                  match: {
                    summary: "Foo Bar"
                  }
                }
              ]
            }
          }
        }
      ]);
    });

    it("should build a search from params with a from/to period", function() {
      const request = {
        skip: 0,
        take: 10,
        dateFrom: "2016/12/18",
        dateTo: "2016/12/18"
      };

      const msearchBuilder = new MultiSearchBuilder();
      searchBuilders.buildPublicEventSearch(msearchBuilder, request);

      const result = msearchBuilder.build();

      expect(result).toEqual([
        { index: constants.SEARCH_INDEX_TYPE_EVENT_FULL, type: "doc" },
        {
          size: 10,
          from: 0,
          _source: constants.SUMMARY_EVENT_SOURCE_FIELDS_WITH_DATES,
          sort: [
            { _score: { order: "desc" } },
            { name_sort: { order: "asc" } }
          ],
          query: {
            bool: {
              filter: [
                {
                  term: {
                    status: "Active"
                  }
                },
                {
                  nested: {
                    path: "dates",
                    query: {
                      bool: {
                        filter: [
                          {
                            range: { "dates.date": { gte: "2016/12/18" } }
                          },
                          {
                            range: { "dates.date": { lte: "2016/12/18" } }
                          }
                        ]
                      }
                    }
                  }
                }
              ]
            }
          }
        }
      ]);
    });

    it("should build a search from params with a time", function() {
      const request = {
        skip: 0,
        take: 10,
        timeFrom: "10:00",
        timeTo: "18:00"
      };

      const msearchBuilder = new MultiSearchBuilder();
      searchBuilders.buildPublicEventSearch(msearchBuilder, request);

      const result = msearchBuilder.build();

      expect(result).toEqual([
        { index: constants.SEARCH_INDEX_TYPE_EVENT_FULL, type: "doc" },
        {
          size: 10,
          from: 0,
          _source: constants.SUMMARY_EVENT_SOURCE_FIELDS,
          sort: [
            { _score: { order: "desc" } },
            { name_sort: { order: "asc" } }
          ],
          query: {
            bool: {
              filter: [
                {
                  term: {
                    status: "Active"
                  }
                },
                {
                  nested: {
                    path: "dates",
                    query: {
                      bool: {
                        filter: [
                          {
                            range: { "dates.to": { gt: "10:00" } }
                          },
                          {
                            range: { "dates.from": { lte: "18:00" } }
                          }
                        ]
                      }
                    }
                  }
                }
              ]
            }
          }
        }
      ]);
    });

    it("should build a search from params with a date range and a time range", function() {
      const request = {
        skip: 0,
        take: 10,
        dateFrom: "2017/01/13",
        dateTo: "2017/01/15",
        timeFrom: "10:00",
        timeTo: "18:00"
      };

      const msearchBuilder = new MultiSearchBuilder();
      searchBuilders.buildPublicEventSearch(msearchBuilder, request);

      const result = msearchBuilder.build();

      expect(result).toEqual([
        { index: constants.SEARCH_INDEX_TYPE_EVENT_FULL, type: "doc" },
        {
          size: 10,
          from: 0,
          _source: constants.SUMMARY_EVENT_SOURCE_FIELDS_WITH_DATES,
          sort: [
            { _score: { order: "desc" } },
            { name_sort: { order: "asc" } }
          ],
          query: {
            bool: {
              filter: [
                {
                  term: {
                    status: "Active"
                  }
                },
                {
                  nested: {
                    path: "dates",
                    query: {
                      bool: {
                        filter: [
                          {
                            range: { "dates.date": { gte: "2017/01/13" } }
                          },
                          {
                            range: { "dates.date": { lte: "2017/01/15" } }
                          },
                          {
                            range: { "dates.to": { gt: "10:00" } }
                          },
                          {
                            range: { "dates.from": { lte: "18:00" } }
                          }
                        ]
                      }
                    }
                  }
                }
              ]
            }
          }
        }
      ]);
    });

    it("should build a search from params for a full public event search", function() {
      const request = {
        skip: 0,
        take: 10,
        term: "Almeida",
        area: "North",
        artsType: "Performing",
        costType: "Free",
        bookingType: "NotRequired",
        tags: ["medium/painting/surreal"],
        audience: "audience/families",
        dateFrom: "2017/01/13",
        timeFrom: "10:00"
      };

      const msearchBuilder = new MultiSearchBuilder();
      searchBuilders.buildPublicEventSearch(msearchBuilder, request);

      const result = msearchBuilder.build();

      expect(result).toEqual([
        { index: constants.SEARCH_INDEX_TYPE_EVENT_FULL, type: "doc" },
        {
          size: 10,
          from: 0,
          _source: constants.SUMMARY_EVENT_SOURCE_FIELDS,
          sort: [
            { _score: { order: "desc" } },
            { name_sort: { order: "asc" } }
          ],
          query: {
            bool: {
              minimum_should_match: 1,
              filter: [
                { term: { status: "Active" } },
                { term: { area: "North" } },
                {
                  nested: {
                    path: "dates",
                    query: {
                      bool: {
                        filter: [
                          {
                            range: { "dates.date": { gte: "2017/01/13" } }
                          },
                          {
                            range: { "dates.to": { gt: "10:00" } }
                          }
                        ]
                      }
                    }
                  }
                },
                { term: { artsType: "Performing" } },
                { term: { costType: "Free" } },
                { term: { bookingType: "NotRequired" } },
                { term: { tags: "medium/painting/surreal" } },
                {
                  query: {
                    bool: {
                      minimum_should_match: 1,
                      should: [
                        {
                          term: { tags: "audience/families" }
                        },
                        {
                          nested: {
                            path: "dates",
                            query: {
                              bool: {
                                filter: [
                                  {
                                    term: { "dates.tags": "audience/families" }
                                  },
                                  {
                                    range: {
                                      "dates.date": { gte: "2017/01/13" }
                                    }
                                  },
                                  {
                                    range: { "dates.to": { gt: "10:00" } }
                                  }
                                ]
                              }
                            }
                          }
                        }
                      ]
                    }
                  }
                }
              ],
              should: [
                { match: { name: "Almeida" } },
                { match: { venueName: "Almeida" } },
                { match: { summary: "Almeida" } }
              ]
            }
          }
        }
      ]);
    });
  });

  describe("buildEventSearch", function() {
    const source = constants.SUMMARY_EVENT_SOURCE_FIELDS;

    it("should build a search from a request with no term", function() {
      const request = {
        skip: 0,
        take: 10
      };

      const msearchBuilder = new MultiSearchBuilder();
      searchBuilders.buildEventSearch(msearchBuilder, request);

      const result = msearchBuilder.build();

      expect(result).toEqual([
        { index: constants.SEARCH_INDEX_TYPE_EVENT_FULL, type: "doc" },
        {
          size: 10,
          from: 0,
          _source: source,
          sort: [
            { _score: { order: "desc" } },
            { name_sort: { order: "asc" } }
          ],
          query: {
            bool: {}
          }
        }
      ]);
    });

    it("should build a search from a request with a term", function() {
      const request = {
        skip: 0,
        take: 10,
        term: "some term"
      };

      const msearchBuilder = new MultiSearchBuilder();
      searchBuilders.buildEventSearch(msearchBuilder, request);

      const result = msearchBuilder.build();

      expect(result).toEqual([
        { index: constants.SEARCH_INDEX_TYPE_EVENT_FULL, type: "doc" },
        {
          size: 10,
          from: 0,
          _source: source,
          sort: [
            { _score: { order: "desc" } },
            { name_sort: { order: "asc" } }
          ],
          query: {
            bool: {
              minimum_should_match: 1,
              should: [
                {
                  match: {
                    name: "some term"
                  }
                },
                {
                  match: {
                    venueName: "some term"
                  }
                },
                {
                  match: {
                    summary: "some term"
                  }
                }
              ]
            }
          }
        }
      ]);
    });
  });

  describe("buildEventSeriesSearch", function() {
    const source = constants.SUMMARY_EVENT_SERIES_SOURCE_FIELDS;

    it("should build a search from a request without a term", function() {
      const request = {
        skip: 0,
        take: 10
      };

      const msearchBuilder = new MultiSearchBuilder();
      searchBuilders.buildEventSeriesSearch(msearchBuilder, request);

      const result = msearchBuilder.build();

      expect(result).toEqual([
        {
          index: constants.SEARCH_INDEX_TYPE_EVENT_SERIES_FULL,
          type: "doc"
        },
        {
          size: 10,
          from: 0,
          _source: source,
          sort: [
            { _score: { order: "desc" } },
            { name_sort: { order: "asc" } }
          ],
          query: {
            bool: {}
          }
        }
      ]);
    });

    it("should build a search from a request with a term", function() {
      const request = {
        skip: 0,
        take: 10,
        term: "some term"
      };

      const msearchBuilder = new MultiSearchBuilder();
      searchBuilders.buildEventSeriesSearch(msearchBuilder, request);

      const result = msearchBuilder.build();

      expect(result).toEqual([
        {
          index: constants.SEARCH_INDEX_TYPE_EVENT_SERIES_FULL,
          type: "doc"
        },
        {
          size: 10,
          from: 0,
          _source: source,
          sort: [
            { _score: { order: "desc" } },
            { name_sort: { order: "asc" } }
          ],
          query: {
            bool: {
              must: [
                {
                  match: {
                    name: "some term"
                  }
                }
              ]
            }
          }
        }
      ]);
    });
  });

  describe("buildVenueSearch", function() {
    const source = constants.SUMMARY_VENUE_SOURCE_FIELDS;

    it("should build a search from a request with no params", function() {
      const request = {
        skip: 0,
        take: 10
      };

      const msearchBuilder = new MultiSearchBuilder();
      searchBuilders.buildVenueSearch(msearchBuilder, request);

      const result = msearchBuilder.build();

      expect(result).toEqual([
        { index: constants.SEARCH_INDEX_TYPE_VENUE_FULL, type: "doc" },
        {
          size: 10,
          from: 0,
          _source: source,
          sort: [
            { _score: { order: "desc" } },
            { name_sort: { order: "asc" } }
          ],
          query: {
            bool: {}
          }
        }
      ]);
    });

    it("should build a search from a request with a term", function() {
      const request = {
        skip: 0,
        take: 10,
        term: "some term"
      };

      const msearchBuilder = new MultiSearchBuilder();
      searchBuilders.buildVenueSearch(msearchBuilder, request);

      const result = msearchBuilder.build();

      expect(result).toEqual([
        { index: constants.SEARCH_INDEX_TYPE_VENUE_FULL, type: "doc" },
        {
          size: 10,
          from: 0,
          _source: source,
          sort: [
            { _score: { order: "desc" } },
            { name_sort: { order: "asc" } }
          ],
          query: {
            bool: {
              must: [
                {
                  match: {
                    name: "some term"
                  }
                }
              ]
            }
          }
        }
      ]);
    });

    it("should build a search from a request with a location", function() {
      const request = {
        skip: 0,
        take: 10,
        location: {
          north: 54,
          west: 1,
          south: 50,
          east: 3
        }
      };

      const msearchBuilder = new MultiSearchBuilder();
      searchBuilders.buildVenueSearch(msearchBuilder, request, true);

      const result = msearchBuilder.build();

      expect(result).toEqual([
        { index: constants.SEARCH_INDEX_TYPE_VENUE_FULL, type: "doc" },
        {
          size: 10,
          from: 0,
          _source: source,
          sort: [
            { _score: { order: "desc" } },
            { name_sort: { order: "asc" } }
          ],
          query: {
            bool: {
              filter: [
                {
                  term: {
                    status: "Active"
                  }
                },
                {
                  geo_bounding_box: {
                    type: "indexed",
                    locationOptimized: {
                      top_left: {
                        lat: 54,
                        lon: 1
                      },
                      bottom_right: {
                        lat: 50,
                        lon: 3
                      }
                    }
                  }
                }
              ]
            }
          }
        }
      ]);
    });
  });

  describe("buildTalentSearch", function() {
    const source = constants.SUMMARY_TALENT_SOURCE_FIELDS;

    it("should build a search from a request without a term", function() {
      const request = {
        skip: 0,
        take: 10
      };

      const msearchBuilder = new MultiSearchBuilder();
      searchBuilders.buildTalentSearch(msearchBuilder, request);

      const result = msearchBuilder.build();

      expect(result).toEqual([
        { index: constants.SEARCH_INDEX_TYPE_TALENT_FULL, type: "doc" },
        {
          size: 10,
          from: 0,
          _source: source,
          sort: [
            { _score: { order: "desc" } },
            { lastName_sort: { order: "asc" } },
            { "firstNames.sort": { order: "asc" } }
          ],
          query: {
            bool: {}
          }
        }
      ]);
    });

    it("should build a search from a request with a term", function() {
      const request = {
        skip: 0,
        take: 10,
        term: "foo bar"
      };

      const msearchBuilder = new MultiSearchBuilder();
      searchBuilders.buildTalentSearch(msearchBuilder, request);

      const result = msearchBuilder.build();

      expect(result).toEqual([
        { index: constants.SEARCH_INDEX_TYPE_TALENT_FULL, type: "doc" },
        {
          size: 10,
          from: 0,
          _source: source,
          sort: [
            { _score: { order: "desc" } },
            { lastName_sort: { order: "asc" } },
            { "firstNames.sort": { order: "asc" } }
          ],
          query: {
            bool: {
              must: [
                {
                  multi_match: {
                    query: "foo bar",
                    type: "cross_fields",
                    operator: "or",
                    fields: ["firstNames", "lastName"]
                  }
                }
              ]
            }
          }
        }
      ]);
    });
  });

  describe("buildSuggestSearch", function() {
    const msearchBuilder = new MultiSearchBuilder();
    searchBuilders.buildSuggestSearch(msearchBuilder, "venue-auto", "foo");

    const result = msearchBuilder.build();

    expect(result).toEqual([
      { index: "venue-auto", type: "doc" },
      {
        size: 0,
        suggest: {
          autocomplete: {
            text: "foo",
            completion: {
              size: constants.AUTOCOMPLETE_MAX_RESULTS,
              field: "nameSuggest"
            }
          },
          fuzzyAutocomplete: {
            text: "foo",
            completion: {
              size: constants.AUTOCOMPLETE_MAX_RESULTS,
              field: "nameSuggest",
              fuzzy: {}
            }
          }
        }
      }
    ]);
  });
});
