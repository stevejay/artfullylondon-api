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
      { skip: 0, take: 12 },
      {
        skip: 0,
        take: 12,
        hasTerm: false,
        hasArea: false,
        hasArtsType: false,
        hasCostType: false,
        hasBookingType: false,
        hasVenueId: false,
        hasTalentId: false,
        hasEventSeriesId: false,
        hasTags: false,
        hasDates: false,
        hasNestedQuery: false,
        hasDateFrom: false,
        hasDateTo: false,
        hasTimeFrom: false,
        hasTimeTo: false,
        hasAudience: false,
        hasLocation: false
      }
    ],
    [
      {
        admin: true,
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
        skip: 100,
        take: 50,
        venueId: "venue/venue1",
        talentId: "talent/talent1",
        eventSeriesId: "event-series/eventseries1"
      },
      {
        admin: true,
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
        skip: 100,
        take: 50,
        venueId: "venue/venue1",
        talentId: "talent/talent1",
        eventSeriesId: "event-series/eventseries1",
        hasTerm: true,
        hasArea: true,
        hasArtsType: false,
        hasCostType: true,
        hasBookingType: true,
        hasVenueId: true,
        hasTalentId: true,
        hasEventSeriesId: true,
        hasTags: true,
        hasDates: true,
        hasNestedQuery: true,
        hasDateFrom: true,
        hasDateTo: true,
        hasTimeFrom: true,
        hasTimeTo: true,
        hasAudience: true,
        hasLocation: true
      }
    ],
    [
      {
        skip: 0,
        take: 12,
        medium: ":all-visual",
        style: "style/contemporary",
        audience: "audience/families"
      },
      {
        skip: 0,
        take: 12,
        medium: ":all-visual",
        style: "style/contemporary",
        audience: "audience/families",
        artsType: artsType.VISUAL,
        hasTerm: false,
        hasArea: false,
        hasArtsType: true,
        hasCostType: false,
        hasBookingType: false,
        hasVenueId: false,
        hasTalentId: false,
        hasEventSeriesId: false,
        hasTags: false,
        hasDates: false,
        hasNestedQuery: true,
        hasDateFrom: false,
        hasDateTo: false,
        hasTimeFrom: false,
        hasTimeTo: false,
        hasAudience: true,
        hasLocation: false
      }
    ]
  ])("%o should map to %o", (arg, expected) => {
    expect(mapper.mapEventAdvancedSearchParams(deepFreeze(arg))).toEqual(
      expected
    );
  });
});

describe("mapEventsByExternalIdsSearchParams", () => {
  test.each([
    [{ id: "" }, { ids: [] }],
    [{ id: "foo,bar" }, { ids: ["foo", "bar"] }]
  ])("%o should map to %o", (arg, expected) => {
    expect(mapper.mapEventsByExternalIdsSearchParams(deepFreeze(arg))).toEqual(
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

describe("mapSimpleQuerySearchResults", () => {
  test.each([
    [{ hits: { hits: [], total: 0 } }, { items: [], total: 0 }],
    [
      { hits: { hits: [{ _source: { id: "event/event-1" } }], total: 100 } },
      { items: [{ id: "event/event-1" }], total: 100 }
    ]
  ])("%o should map to %o", (arg, expected) => {
    expect(mapper.mapSimpleQuerySearchResults(deepFreeze(arg))).toEqual(
      expected
    );
  });
});

describe("mapEntityCountsSearchResults", () => {
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
        items: [
          { entityType: entityType.EVENT, count: 1 },
          { entityType: entityType.EVENT_SERIES, count: 2 },
          { entityType: entityType.TALENT, count: 3 },
          { entityType: entityType.VENUE, count: 4 }
        ]
      }
    ]
  ])("%o should map to %o", (arg, expected) => {
    expect(mapper.mapEntityCountsSearchResults(deepFreeze(arg))).toEqual(
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
