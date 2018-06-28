import deepFreeze from "deep-freeze";
import * as normaliser from "./normaliser";
import * as presetSearchType from "./types/preset-search-type";
import * as entityType from "./types/entity-type";
import * as costType from "./types/cost-type";
import * as bookingType from "./types/booking-type";
import * as areaType from "./types/area-type";

describe("normaliseAutocompleteSearchRequest", () => {
  test.each([
    [{ admin: "", term: "", entityType: "" }, { term: "" }],
    [
      { admin: "true", term: "  foo  ", entityType: entityType.EVENT },
      { admin: true, term: "foo", entityType: entityType.EVENT }
    ]
  ])("%o should normalise to %o", (arg, expected) => {
    expect(
      normaliser.normaliseAutocompleteSearchRequest(deepFreeze(arg))
    ).toEqual(expected);
  });
});

describe("normaliseBasicSearchRequest", () => {
  test.each([
    [
      {
        admin: "",
        term: "",
        entityType: "",
        north: "",
        west: "",
        south: "",
        east: "",
        skip: "",
        take: ""
      },
      { skip: 0, take: 12 }
    ],
    [
      {
        admin: "true",
        term: "  foo ",
        entityType: entityType.TALENT,
        north: "1.5",
        west: "2.5",
        south: "3.5",
        east: "4.5",
        skip: "100",
        take: "50"
      },
      {
        admin: true,
        term: "foo",
        entityType: entityType.TALENT,
        north: 1.5,
        west: 2.5,
        south: 3.5,
        east: 4.5,
        skip: 100,
        take: 50
      }
    ],
    [
      {
        admin: "true",
        term: "  foo ",
        entityType: entityType.EVENT,
        north: 1.5,
        west: 2.5,
        south: 3.5,
        east: 4.5,
        skip: 100,
        take: 50
      },
      {
        admin: true,
        term: "foo",
        entityType: entityType.EVENT,
        north: 1.5,
        west: 2.5,
        south: 3.5,
        east: 4.5,
        skip: 100,
        take: 50
      }
    ]
  ])("%o should normalise to %o", (arg, expected) => {
    expect(normaliser.normaliseBasicSearchRequest(deepFreeze(arg))).toEqual(
      expected
    );
  });
});

describe("normaliseEventAdvancedSearchRequest", () => {
  test.each([
    [
      {
        admin: "",
        term: "",
        dateFrom: "",
        dateTo: "",
        timeFrom: "",
        timeTo: "",
        area: "",
        medium: "",
        style: "",
        audience: "",
        costType: "",
        bookingType: "",
        north: "",
        west: "",
        south: "",
        east: "",
        venueId: "",
        talentId: "",
        eventSeriesId: "",
        skip: "",
        take: ""
      },
      { skip: 0, take: 12 }
    ],
    [
      {
        admin: "true",
        term: "  foo   ",
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
        north: "1.5",
        west: "2.5",
        south: "3.5",
        east: "4.5",
        skip: "100",
        take: "50",
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
      }
    ]
  ])("%o should normalise to %o", (arg, expected) => {
    expect(
      normaliser.normaliseEventAdvancedSearchRequest(deepFreeze(arg))
    ).toEqual(expected);
  });
});

describe("normalisePresetSearchRequest", () => {
  test.each([
    [{ admin: "", name: "", id: "" }, { name: "", id: "" }],
    [
      {
        admin: "true",
        name: presetSearchType.TALENT_RELATED_EVENTS,
        id: "event/event1"
      },
      {
        admin: true,
        name: presetSearchType.TALENT_RELATED_EVENTS,
        id: "event/event1"
      }
    ]
  ])("%o should normalise to %o", (arg, expected) => {
    expect(normaliser.normalisePresetSearchRequest(deepFreeze(arg))).toEqual(
      expected
    );
  });
});
