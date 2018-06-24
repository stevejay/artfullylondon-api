import deepFreeze from "deep-freeze";
import * as validator from "./validator";
import * as presetSearchType from "./types/preset-search-type";
import * as entityType from "./types/entity-type";
import * as costType from "./types/cost-type";
import * as bookingType from "./types/booking-type";
import * as areaType from "./types/area-type";

describe("validateAutocompleteSearchRequest", () => {
  test.each([
    [{ term: "f", entityType: entityType.ALL }],
    [{ admin: true, term: "foo", entityType: entityType.EVENT }]
  ])("%o should validate", arg => {
    expect(() =>
      validator.validateAutocompleteSearchRequest(deepFreeze(arg))
    ).not.toThrow();
  });

  test.each([
    [{ term: "", entityType: entityType.ALL }],
    [{ admin: true, term: "foo", entityType: "not-a-type" }]
  ])("%o should fail to validate", arg => {
    expect(() =>
      validator.validateAutocompleteSearchRequest(deepFreeze(arg))
    ).toThrow();
  });
});

describe("validateBasicSearchRequest", () => {
  test.each([
    [{ entityType: entityType.ALL, skip: 0, take: 12 }],
    [
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
  ])("%o should validate", arg => {
    expect(() =>
      validator.validateBasicSearchRequest(deepFreeze(arg))
    ).not.toThrow();
  });

  test.each([
    [{ entityType: "not-a-type", skip: 0, take: 12 }],
    [
      {
        admin: true,
        term: "foo",
        entityType: entityType.TALENT,
        north: "bar",
        west: 2.5,
        south: 3.5,
        east: 4.5,
        skip: 100,
        take: 50
      }
    ],
    [
      {
        admin: true,
        term: "foo",
        entityType: entityType.EVENT,
        north: 1.5,
        west: 2.5,
        south: 3.5,
        east: 4.5,
        skip: -100,
        take: 50
      }
    ]
  ])("%o should fail to validate", arg => {
    expect(() =>
      validator.validateBasicSearchRequest(deepFreeze(arg))
    ).toThrow();
  });
});

describe("validateEventAdvancedSearchRequest", () => {
  test.each([
    [{ skip: 0, take: 12 }],
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
        venueId: "venue1",
        talentId: "talent1",
        eventSeriesId: "eventseries1"
      }
    ]
  ])("%o should validate", arg => {
    expect(() =>
      validator.validateEventAdvancedSearchRequest(deepFreeze(arg))
    ).not.toThrow();
  });

  test.each([
    [
      {
        admin: true,
        term: "foo",
        dateFrom: "2017-01-01",
        dateTo: "2018-01-01",
        timeFrom: "18:00",
        timeTo: "20:00",
        area: areaType.NORTH,
        medium: "painting",
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
        venueId: "venue1",
        talentId: "talent1"
      }
    ]
  ])("%o should fail to validate", arg => {
    expect(() =>
      validator.validateEventAdvancedSearchRequest(deepFreeze(arg))
    ).toThrow();
  });
});

describe("validatePresetSearch", () => {
  test.each([
    [
      {
        admin: true,
        name: presetSearchType.TALENT_RELATED_EVENTS,
        id: "event1"
      }
    ]
  ])("%o should validate", arg => {
    expect(() => validator.validatePresetSearch(deepFreeze(arg))).not.toThrow();
  });

  test.each([
    [
      {
        admin: true,
        name: "not-a-preset-type",
        id: "event1"
      }
    ]
  ])("%o should fail to validate", arg => {
    expect(() => validator.validatePresetSearch(deepFreeze(arg))).toThrow();
  });
});

describe("validateIndexDocumentRequest", () => {
  describe("valid requests", () => {
    test.each([
      [
        {
          entityType: entityType.TALENT,
          entity: { id: "talent1", entityType: entityType.TALENT, version: 1 }
        }
      ]
    ])("%o should validate", arg => {
      expect(() =>
        validator.validateIndexDocumentRequest(deepFreeze(arg))
      ).not.toThrow();
    });
  });

  describe("invalid requests", () => {
    test.each([
      [
        {
          entityType: "not-a-type",
          entity: { id: "talent1", entityType: entityType.TALENT, version: 2 }
        }
      ]
    ])("%o should fail to validate", arg => {
      expect(() =>
        validator.validateIndexDocumentRequest(deepFreeze(arg))
      ).toThrow();
    });
  });
});
