import deepFreeze from "deep-freeze";
import * as mapper from "./mapper";
import * as entityType from "../types/entity-type";
import * as costType from "../types/cost-type";
import * as bookingType from "../types/booking-type";
import * as areaType from "../types/area-type";
import * as artsType from "../types/arts-type";

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
    [{}, { results: [] }],
    [
      {
        suggest: {
          autocomplete: [
            {
              options: [
                { text: "1", _source: { id: "event/event-1" } },
                { text: "3", _source: { id: "event/event-3" } }
              ]
            }
          ],
          fuzzyAutocomplete: [
            {
              options: [
                { text: "1", _source: { id: "event/event-1" } },
                { text: "2", _source: { id: "event/event-2" } }
              ]
            }
          ]
        }
      },
      {
        results: [
          { id: "event/event-1", name: "1" },
          { id: "event/event-3", name: "3" },
          { id: "event/event-2", name: "2" }
        ]
      }
    ]
  ])("%o should map to %o", (arg, expected) => {
    expect(mapper.mapAutocompleteSearchResults(deepFreeze(arg))).toEqual(
      expected
    );
  });
});

describe("mapEntityCountSearchResults", () => {
  test.each([
    [
      {
        responses: [
          { hits: { total: 1 } },
          { hits: { total: 2 } },
          { hits: { total: 3 } },
          { hits: { total: 4 } }
        ]
      },
      {
        results: [
          { entityType: entityType.EVENT, count: 1 },
          { entityType: entityType.EVENT_SERIES, count: 2 },
          { entityType: entityType.TALENT, count: 3 },
          { entityType: entityType.VENUE, count: 4 }
        ]
      }
    ]
  ])("%o should map to %o", (arg, expected) => {
    expect(mapper.mapEntityCountSearchResults(deepFreeze(arg))).toEqual(
      expected
    );
  });
});

describe("mapBasicSearchResults", () => {
  test.each([
    [
      {
        responses: []
      },
      12,
      { edges: [], pageInfo: { hasNextPage: false } }
    ],
    [
      {
        responses: [
          {
            hits: {
              hits: [{ _source: { id: "event/event-1" }, sort: [123] }]
            }
          }
        ]
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
        responses: [
          {
            hits: { hits: [{ _source: { id: "event/event-1" } }] }
          },
          {
            hits: {
              hits: [{ _source: { id: "event-series/event-series-1" } }]
            }
          },
          {
            hits: { hits: [{ _source: { id: "talent/talent-1" } }] }
          },
          { hits: { hits: [{ _source: { id: "venue/venue-1" } }] } }
        ]
      },
      2,
      {
        edges: [
          {
            node: { id: "event/event-1" },
            cursor: ""
          },
          {
            node: { id: "event-series/event-series-1" },
            cursor: ""
          }
        ],
        pageInfo: { hasNextPage: false }
      }
    ]
  ])("%o with first %d should map to %o", (arg, first, expected) => {
    expect(mapper.mapBasicSearchResults(deepFreeze(arg), first)).toEqual(
      expected
    );
  });
});

describe("mapEventAdvancedSearchResults", () => {
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
    ]
  ])("%o with first %d should map to %o", (arg, first, expected) => {
    expect(
      mapper.mapEventAdvancedSearchResults(deepFreeze(arg), first)
    ).toEqual(expected);
  });
});
