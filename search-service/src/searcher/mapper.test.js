import deepFreeze from "deep-freeze";
import * as mapper from "./mapper";
import * as entityType from "../types/entity-type";
import * as costType from "../types/cost-type";
import * as bookingType from "../types/booking-type";
import * as areaType from "../types/area-type";
import * as artsType from "../types/arts-type";

describe("mapSitemapEventSearchParams", () => {
  it("should map the params", () => {
    const result = mapper.mapSitemapEventSearchParams();
    expect(result).toEqual({
      dateTo: expect.stringMatching(/^2\d\d\d-\d\d-\d\d$/)
    });
  });
});

describe("mapSitemapEventSearchResults", () => {
  const response = {
    hits: {
      hits: [{ _source: { id: "event/1" } }, { _source: { id: "event/2" } }]
    }
  };
  const result = mapper.mapSitemapEventSearchResults(response);
  expect(result).toEqual({
    results: [{ id: "event/1" }, { id: "event/2" }]
  });
});

describe("mapAutocompleteSearchParams", () => {
  test.each([[{ term: "Foo" }, { term: "foo" }]])(
    "%o should map to %o",
    (arg, expected) => {
      expect(mapper.mapAutocompleteSearchParams(deepFreeze(arg))).toEqual(
        expected
      );
    }
  );
});

describe("mapBasicSearchParams", () => {
  test.each([
    [
      {},
      {
        after: null,
        first: 12,
        hasLocation: false
      }
    ],
    [
      { after: "", first: 12 },
      {
        after: null,
        first: 12,
        hasLocation: false
      }
    ],
    [
      {
        admin: true,
        term: "foo",
        entityType: entityType.TALENT,
        north: 1.5,
        west: 2.5,
        south: 3.5,
        east: 4.5,
        after: '[0.65, "carrie"]',
        first: 50
      },
      {
        admin: true,
        term: "foo",
        entityType: entityType.TALENT,
        north: 1.5,
        west: 2.5,
        south: 3.5,
        east: 4.5,
        after: [0.65, "carrie"],
        first: 50,
        hasLocation: true
      }
    ]
  ])("%o should map to %o", (arg, expected) => {
    expect(mapper.mapBasicSearchParams(deepFreeze(arg))).toEqual(expected);
  });
});

describe("mapEventAdvancedSearchParams", () => {
  test.each([
    [
      {},
      {
        after: null,
        first: 12,
        hasDates: false,
        hasNestedQuery: false,
        hasLocation: false
      }
    ],
    [
      { after: "", first: 12 },
      {
        after: null,
        first: 12,
        hasDates: false,
        hasNestedQuery: false,
        hasLocation: false
      }
    ],
    [
      {
        term: "foo",
        dateFrom: "2017-01-01",
        dateTo: "2018-01-01",
        timeFrom: "18:00",
        timeTo: "20:00",
        area: areaType.NORTH,
        medium: "medium/painting",
        style: "style/contemporary",
        audience: "audience/families",
        costType: costType.FREE,
        bookingType: bookingType.REQUIRED,
        north: 1.5,
        west: 2.5,
        south: 3.5,
        east: 4.5,
        venueId: "venue/venue1",
        talentId: "talent/talent1",
        eventSeriesId: "event-series/eventseries1",
        after: '[0.65, "carrie"]',
        first: 50
      },
      {
        term: "foo",
        dateFrom: "2017-01-01",
        dateTo: "2018-01-01",
        timeFrom: "18:00",
        timeTo: "20:00",
        area: areaType.NORTH,
        medium: "medium/painting",
        style: "style/contemporary",
        tags: ["medium/painting/contemporary"],
        audience: "audience/families",
        costType: costType.FREE,
        bookingType: bookingType.REQUIRED,
        north: 1.5,
        west: 2.5,
        south: 3.5,
        east: 4.5,
        after: [0.65, "carrie"],
        first: 50,
        venueId: "venue/venue1",
        talentId: "talent/talent1",
        eventSeriesId: "event-series/eventseries1",
        hasDates: true,
        hasNestedQuery: true,
        hasLocation: true
      }
    ],
    [
      {
        after: '[0.65, "carrie"]',
        first: 50,
        medium: ":all-visual",
        style: "style/contemporary",
        audience: "audience/families"
      },
      {
        after: [0.65, "carrie"],
        first: 50,
        medium: ":all-visual",
        style: "style/contemporary",
        audience: "audience/families",
        artsType: artsType.VISUAL,
        hasDates: false,
        hasNestedQuery: true,
        hasLocation: false
      }
    ]
  ])("%o should map to %o", (arg, expected) => {
    expect(mapper.mapEventAdvancedSearchParams(deepFreeze(arg))).toEqual(
      expected
    );
  });
});

describe("mapAutocompleteSearchResults", () => {
  test.each([
    [null, {}, { results: [] }],
    [
      entityType.EVENT,
      {
        suggest: {
          [entityType.EVENT]: [
            {
              options: [
                { _source: { id: "event/event-1", output: "e1" } },
                { _source: { id: "event/event-3", output: "e3" } }
              ]
            }
          ],
          [`${entityType.EVENT}_fuzzy`]: [
            {
              options: [
                { _source: { id: "event/event-1", output: "e1" } },
                { _source: { id: "event/event-2", output: "e2" } }
              ]
            }
          ]
        }
      },
      {
        results: [
          { id: "event/event-1", name: "e1" },
          { id: "event/event-3", name: "e3" },
          { id: "event/event-2", name: "e2" }
        ]
      }
    ],
    [
      null,
      {
        suggest: {
          [entityType.EVENT]: [
            {
              options: [
                { _source: { id: "event/event-1", output: "e1" } },
                { _source: { id: "event/event-3", output: "e3" } }
              ]
            }
          ],
          [`${entityType.EVENT}_fuzzy`]: [
            {
              options: [
                { _source: { id: "event/event-1", output: "e1" } },
                { _source: { id: "event/event-2", output: "e2" } }
              ]
            }
          ],
          [entityType.EVENT_SERIES]: [
            {
              options: [
                {
                  _source: { id: "event-series/event-series-1", output: "es1" }
                },
                {
                  _source: { id: "event-series/event-series-3", output: "es3" }
                }
              ]
            }
          ],
          [`${entityType.EVENT_SERIES}_fuzzy`]: [
            {
              options: [
                {
                  _source: { id: "event-series/event-series-1", output: "es1" }
                },
                {
                  _source: { id: "event-series/event-series-2", output: "es2" }
                }
              ]
            }
          ],
          [entityType.TALENT]: [
            {
              options: [
                { _source: { id: "talent/talent-1", output: "t1" } },
                { _source: { id: "talent/talent-3", output: "t3" } }
              ]
            }
          ],
          [`${entityType.TALENT}_fuzzy`]: [
            {
              options: [
                { _source: { id: "talent/talent-1", output: "t1" } },
                { _source: { id: "talent/talent-2", output: "t2" } }
              ]
            }
          ],
          [entityType.VENUE]: [
            {
              options: [
                { _source: { id: "venue/venue-1", output: "v1" } },
                { _source: { id: "venue/venue-3", output: "v3" } }
              ]
            }
          ],
          [`${entityType.VENUE}_fuzzy`]: [
            {
              options: [
                { _source: { id: "venue/venue-1", output: "v1" } },
                { _source: { id: "venue/venue-2", output: "v2" } },
                { _source: { id: "venue/venue-4", output: "v4" } }
              ]
            }
          ]
        }
      },
      {
        results: [
          { id: "event/event-1", name: "e1" },
          { id: "event/event-3", name: "e3" },
          { id: "event/event-2", name: "e2" },
          { id: "event-series/event-series-1", name: "es1" },
          { id: "event-series/event-series-3", name: "es3" },
          { id: "event-series/event-series-2", name: "es2" },
          { id: "venue/venue-1", name: "v1" },
          { id: "venue/venue-3", name: "v3" },
          { id: "venue/venue-2", name: "v2" },
          { id: "talent/talent-1", name: "t1" },
          { id: "talent/talent-3", name: "t3" },
          { id: "talent/talent-2", name: "t2" }
        ]
      }
    ]
  ])("a %s search with result %o should map to %o", (type, arg, expected) => {
    expect(mapper.mapAutocompleteSearchResults(deepFreeze(arg), type)).toEqual(
      expected
    );
  });
});

describe("mapEntityCountSearchResults", () => {
  test.each([
    [
      {
        aggregations: {
          [entityType.EVENT]: { doc_count: 1 },
          [entityType.EVENT_SERIES]: { doc_count: 2 },
          [entityType.VENUE]: { doc_count: 3 },
          [entityType.TALENT]: { doc_count: 4 }
        }
      },
      {
        results: [
          { entityType: entityType.EVENT, count: 1 },
          { entityType: entityType.EVENT_SERIES, count: 2 },
          { entityType: entityType.VENUE, count: 3 },
          { entityType: entityType.TALENT, count: 4 }
        ]
      }
    ]
  ])("%o should map to %o", (arg, expected) => {
    expect(mapper.mapEntityCountSearchResults(deepFreeze(arg))).toEqual(
      expected
    );
  });
});

describe("mapEntitySearchResults", () => {
  test.each([
    [
      {
        hits: {
          hits: []
        }
      },
      12,
      { edges: [], pageInfo: { hasNextPage: false } }
    ],
    [
      {
        hits: {
          hits: [{ _source: { id: "event/event-1" }, sort: [123] }]
        }
      },
      12,
      {
        edges: [
          {
            node: { id: "event/event-1" },
            cursor: "[123]"
          }
        ],
        pageInfo: { hasNextPage: false }
      }
    ],
    [
      {
        hits: {
          hits: [
            { _source: { id: "event/event-1" }, sort: [123] },
            { _source: { id: "event-series/event-series-1" }, sort: [456] }
          ]
        }
      },
      2,
      {
        edges: [
          {
            node: { id: "event/event-1" },
            cursor: "[123]"
          },
          {
            node: { id: "event-series/event-series-1" },
            cursor: "[456]"
          }
        ],
        pageInfo: { hasNextPage: true }
      }
    ],
    [
      {
        hits: {
          hits: [
            { _source: { id: "event/event-1" }, sort: [123] },
            { _source: { id: "event-series/event-series-1" }, sort: [456] }
          ]
        }
      },
      20,
      {
        edges: [
          {
            node: { id: "event/event-1" },
            cursor: "[123]"
          },
          {
            node: { id: "event-series/event-series-1" },
            cursor: "[456]"
          }
        ],
        pageInfo: { hasNextPage: false }
      }
    ]
  ])("%o with first %d should map to %o", (arg, first, expected) => {
    expect(mapper.mapEntitySearchResults(deepFreeze(arg), first)).toEqual(
      expected
    );
  });
});
