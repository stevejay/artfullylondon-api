"use strict";

const moment = require("moment");
const testData = require("../test-data");
const constants = require("./constants");
const mappings = require("./mappings");
const date = require("../date");

describe("mapRequestToDbItem", () => {
  beforeEach(() => {
    date.getTodayAsStringDate = jest.fn().mockReturnValue("2016/01/11");
  });

  it("should map a minimal performance event", () => {
    const params = testData.createMinimalPerformanceRequestEvent();

    const result = mappings.mapRequestToDbItem(
      testData.PERFORMANCE_EVENT_ID,
      params
    );

    expect(result).toEqual({
      id: testData.PERFORMANCE_EVENT_ID,
      status: "Active",
      name: "Taming of the Shrew",
      eventType: "Performance",
      occurrenceType: "Bounded",
      bookingType: "NotRequired",
      dateFrom: "2016/02/11",
      dateTo: "2016/02/13",
      rating: 3,
      useVenueOpeningTimes: false,
      costType: "Free",
      summary: "A Shakespearian classic",
      venueId: testData.EVENT_VENUE_ID,
      version: 4,
      schemeVersion: constants.CURRENT_EVENT_SCHEME_VERSION,
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11"
    });
  });

  it("should map a fully populated performance event", () => {
    const params = testData.createFullPerformanceRequestEvent();
    params.talents[0].characters = ["Polonius"];

    const result = mappings.mapRequestToDbItem(
      testData.PERFORMANCE_EVENT_ID,
      params
    );

    expect(result).toEqual({
      id: testData.PERFORMANCE_EVENT_ID,
      status: "Active",
      name: "Taming of the Shrew",
      eventType: "Performance",
      occurrenceType: "Bounded",
      dateFrom: "2016/02/11",
      dateTo: "2016/02/13",
      costType: "Paid",
      costFrom: 15.5,
      costTo: 35,
      bookingType: "RequiredForNonMembers",
      bookingOpens: "2016/02/11",
      summary: "A contemporary update of this Shakespeare classic",
      description:
        "A contemporary update of this Shakespeare classic by the acclaimed director Sam Mendes.",
      descriptionCredit: "Some credit",
      rating: 4,
      minAge: 14,
      maxAge: 18,
      links: [{ type: "Wikipedia", url: "https://en.wikipedia.org/foo" }],
      eventSeriesId: testData.EVENT_EVENT_SERIES_ID,
      venueId: testData.EVENT_VENUE_ID,
      venueGuidance:
        "Exhibition is located in the Purcell Room in the Foster Building",
      useVenueOpeningTimes: false,
      timesRanges: [
        {
          id: "all-run",
          label: "all run",
          dateFrom: "2016/02/11",
          dateTo: "2016/02/13"
        }
      ],
      performances: [{ day: 0, at: "18:00", timesRangeId: "all-run" }],
      additionalPerformances: [{ date: "2016/02/11", at: "15:00" }],
      specialPerformances: [
        {
          date: "2016/02/11",
          at: "15:00",
          audienceTags: [{ id: "audience/adult", label: "Adult" }]
        }
      ],
      performancesClosures: [{ date: "2016/12/25" }],
      duration: "01:00",
      talents: [
        {
          id: testData.EVENT_TALENT_ID,
          roles: ["Director"],
          characters: ["Polonius"]
        }
      ],
      audienceTags: [{ id: "audience/families", label: "families" }],
      mediumTags: [{ id: "medium/sculpture", label: "sculpture" }],
      styleTags: [{ id: "style/contemporary", label: "contemporary" }],
      geoTags: [
        { id: "geo/europe", label: "europe" },
        { id: "geo/europe/spain", label: "spain" }
      ],
      images: [
        {
          id: "12345678123456781234567812345678",
          ratio: 1.2,
          copyright: "foo",
          dominantColor: "af0090"
        }
      ],
      reviews: [{ source: "The Guardian", rating: 4 }],
      weSay: "something",
      soldOutPerformances: [{ at: "15:00", date: "2016/02/11" }],
      version: 1,
      schemeVersion: constants.CURRENT_EVENT_SCHEME_VERSION,
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11"
    });
  });

  it("should map a fully populated exhibition event that does not use venue opening times", () => {
    const params = testData.createFullExhibitionRequestEvent();
    params.useVenueOpeningTimes = false;
    params.talents[0].characters = ["Polonius"];

    const result = mappings.mapRequestToDbItem(
      testData.EXHIBITION_EVENT_ID,
      params
    );

    expect(result).toEqual({
      id: testData.EXHIBITION_EVENT_ID,
      status: "Active",
      name: "Taming of the Shrew",
      eventType: "Exhibition",
      occurrenceType: "Bounded",
      dateFrom: "2016/02/11",
      dateTo: "2016/02/13",
      costType: "Paid",
      costFrom: 0,
      costTo: 35,
      timedEntry: true,
      bookingType: "RequiredForNonMembers",
      bookingOpens: "2016/02/11",
      summary: "A contemporary update of this Shakespeare classic",
      description:
        "A contemporary update of this Shakespeare classic by the acclaimed director Sam Mendes.",
      descriptionCredit: "Some credit",
      rating: 4,
      minAge: 14,
      maxAge: 18,
      links: [{ type: "Wikipedia", url: "https://en.wikipedia.org/foo" }],
      eventSeriesId: testData.EVENT_EVENT_SERIES_ID,
      venueId: testData.EVENT_VENUE_ID,
      venueGuidance:
        "Exhibition is located in the Purcell Room in the Foster Building",
      useVenueOpeningTimes: false,
      openingTimes: [{ day: 0, from: "09:00", to: "18:00" }],
      additionalOpeningTimes: [
        { date: "2016/02/11", from: "09:00", to: "18:00" }
      ],
      openingTimesClosures: [{ date: "2016/12/25" }],
      duration: "01:00",
      talents: [
        {
          id: testData.EVENT_TALENT_ID,
          roles: ["Director"],
          characters: ["Polonius"]
        }
      ],
      audienceTags: [{ id: "audience/families", label: "families" }],
      mediumTags: [{ id: "medium/sculpture", label: "sculpture" }],
      styleTags: [{ id: "style/contemporary", label: "contemporary" }],
      geoTags: [
        { id: "geo/europe", label: "europe" },
        { id: "geo/europe/spain", label: "spain" }
      ],
      images: [
        {
          id: "12345678123456781234567812345678",
          ratio: 1.2,
          copyright: "foo",
          dominantColor: "af0090"
        }
      ],
      reviews: [{ source: "The Guardian", rating: 4 }],
      weSay: "something",
      version: 1,
      schemeVersion: constants.CURRENT_EVENT_SCHEME_VERSION,
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11"
    });
  });

  it("should map a fully populated exhibition event that uses the venue opening times", () => {
    const params = testData.createFullExhibitionRequestEvent();
    params.useVenueOpeningTimes = true;

    const result = mappings.mapRequestToDbItem(
      testData.EXHIBITION_EVENT_ID,
      params
    );

    expect(result).toEqual({
      id: testData.EXHIBITION_EVENT_ID,
      status: "Active",
      name: "Taming of the Shrew",
      eventType: "Exhibition",
      occurrenceType: "Bounded",
      dateFrom: "2016/02/11",
      dateTo: "2016/02/13",
      costType: "Paid",
      costFrom: 0,
      costTo: 35,
      timedEntry: true,
      bookingType: "RequiredForNonMembers",
      bookingOpens: "2016/02/11",
      summary: "A contemporary update of this Shakespeare classic",
      description:
        "A contemporary update of this Shakespeare classic by the acclaimed director Sam Mendes.",
      descriptionCredit: "Some credit",
      rating: 4,
      minAge: 14,
      maxAge: 18,
      links: [{ type: "Wikipedia", url: "https://en.wikipedia.org/foo" }],
      eventSeriesId: testData.EVENT_EVENT_SERIES_ID,
      venueId: testData.EVENT_VENUE_ID,
      venueGuidance:
        "Exhibition is located in the Purcell Room in the Foster Building",
      useVenueOpeningTimes: true,
      additionalOpeningTimes: [
        { date: "2016/02/11", from: "09:00", to: "18:00" }
      ],
      openingTimesClosures: [{ date: "2016/12/25" }],
      duration: "01:00",
      talents: [{ id: testData.EVENT_TALENT_ID, roles: ["Director"] }],
      audienceTags: [{ id: "audience/families", label: "families" }],
      mediumTags: [{ id: "medium/sculpture", label: "sculpture" }],
      styleTags: [{ id: "style/contemporary", label: "contemporary" }],
      geoTags: [
        { id: "geo/europe", label: "europe" },
        { id: "geo/europe/spain", label: "spain" }
      ],
      images: [
        {
          id: "12345678123456781234567812345678",
          ratio: 1.2,
          copyright: "foo",
          dominantColor: "af0090"
        }
      ],
      reviews: [{ source: "The Guardian", rating: 4 }],
      weSay: "something",
      version: 1,
      schemeVersion: constants.CURRENT_EVENT_SCHEME_VERSION,
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11"
    });
  });
});

describe("mapDbItemToAdminResponse", () => {
  it("should map performance event with all referenced entities", () => {
    const dbItem = testData.createFullPerformanceDbEvent();
    dbItem.talents[0].characters = ["Polonius"];

    const referencedEntities = {
      eventSeries: [
        {
          entityType: "event-series",
          eventSeriesType: "Occasional",
          id: testData.EVENT_EVENT_SERIES_ID,
          name: "Some Event Series",
          occurrence: "Some occurrence",
          status: "Active",
          summary: "A summary"
        }
      ],
      talent: [
        {
          entityType: "talent",
          commonRole: "Foo",
          id: testData.EVENT_TALENT_ID,
          firstNames: "John",
          lastName: "Doe",
          status: "Active",
          talentType: "Individual"
        }
      ],
      venue: [
        {
          entityType: "venue",
          status: "Active",
          venueType: "Theatre",
          id: testData.EVENT_VENUE_ID,
          name: "Almeida Theatre",
          address: "Islington",
          postcode: "N5 2UA",
          latitude: 53,
          longitude: 2,
          wheelchairAccessType: "FullAccess",
          disabledBathroomType: "Present",
          hearingFacilitiesType: "HearingLoops"
        }
      ]
    };

    const result = mappings.mapDbItemToAdminResponse(
      dbItem,
      referencedEntities
    );

    expect(result).toEqual({
      id: testData.PERFORMANCE_EVENT_ID,
      status: "Active",
      name: "Taming of the Shrew",
      eventType: "Performance",
      occurrenceType: "Bounded",
      dateFrom: "2016/02/11",
      dateTo: "2016/02/13",
      soldOut: true,
      costType: "Paid",
      bookingType: "NotRequired",
      summary: "A Shakespearian classic",
      description: "A contemporary update of this Shakespearian classic",
      descriptionCredit: "Description credit",
      rating: 3,
      minAge: 14,
      maxAge: 18,
      links: [{ type: "Wikipedia", url: "https://en.wikipedia.org/foo" }],
      eventSeries: {
        entityType: "event-series",
        eventSeriesType: "Occasional",
        id: testData.EVENT_EVENT_SERIES_ID,
        name: "Some Event Series",
        occurrence: "Some occurrence",
        status: "Active",
        summary: "A summary",
        description: undefined
      },
      venue: {
        entityType: "venue",
        status: "Active",
        venueType: "Theatre",
        id: testData.EVENT_VENUE_ID,
        name: "Almeida Theatre",
        address: "Islington",
        postcode: "N5 2UA",
        latitude: 53,
        longitude: 2,
        wheelchairAccessType: "FullAccess",
        disabledBathroomType: "Present",
        hearingFacilitiesType: "HearingLoops",
        hasPermanentCollection: false
      },
      venueGuidance: "Through the curtains",
      useVenueOpeningTimes: false,
      timesRanges: [
        {
          id: "all-run",
          label: "all run",
          dateFrom: "2016/02/11",
          dateTo: "2016/02/13"
        }
      ],
      performances: [{ day: 6, at: "12:00", timesRangeId: "all-run" }],
      additionalPerformances: [{ date: "2016/08/15", at: "08:00" }],
      duration: "01:00",
      talents: [
        {
          entityType: "talent",
          commonRole: "Foo",
          id: testData.EVENT_TALENT_ID,
          firstNames: "John",
          lastName: "Doe",
          status: "Active",
          talentType: "Individual",
          roles: ["Director"],
          characters: ["Polonius"]
        }
      ],
      audienceTags: [{ id: "audience/families", label: "families" }],
      mediumTags: [{ id: "medium/sculpture", label: "sculpture" }],
      styleTags: [{ id: "style/contemporary", label: "contemporary" }],
      geoTags: [
        { id: "geo/europe", label: "europe" },
        { id: "geo/spain", label: "spain" }
      ],
      images: [
        {
          id: "12345678123456781234567812345678",
          ratio: 1.2,
          copyright: "foo"
        }
      ],
      reviews: [{ source: "The Guardian", rating: 4 }],
      weSay: "something",
      soldOutPerformances: [{ at: "08:00", date: "2016/08/15" }],
      version: 4,
      schemeVersion: constants.CURRENT_EVENT_SCHEME_VERSION,
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11"
    });
  });

  it("should map exhibition event with all referenced entities", () => {
    const dbItem = testData.createFullExhibitionDbEvent();

    const referencedEntities = {
      eventSeries: [
        {
          entityType: "event-series",
          eventSeriesType: "Occasional",
          id: testData.EVENT_EVENT_SERIES_ID,
          name: "Some Event Series",
          occurrence: "Some occurrence",
          status: "Active",
          summary: "A summary"
        }
      ],
      talent: [
        {
          entityType: "talent",
          commonRole: "Foo",
          id: testData.EVENT_TALENT_ID,
          firstNames: "John",
          lastName: "Doe",
          status: "Active",
          talentType: "Individual"
        }
      ],
      venue: [
        {
          entityType: "venue",
          status: "Active",
          venueType: "Theatre",
          id: testData.EVENT_VENUE_ID,
          name: "Almeida Theatre",
          address: "Islington",
          postcode: "N5 2UA",
          latitude: 53,
          longitude: 2,
          wheelchairAccessType: "FullAccess",
          disabledBathroomType: "Present",
          hearingFacilitiesType: "HearingLoops"
        }
      ]
    };

    const result = mappings.mapDbItemToAdminResponse(
      dbItem,
      referencedEntities
    );

    expect(result).toEqual({
      id: testData.PERFORMANCE_EVENT_ID,
      status: "Active",
      name: "Taming of the Shrew",
      eventType: "Exhibition",
      occurrenceType: "Bounded",
      dateFrom: "2016/02/11",
      dateTo: "2016/02/13",
      costType: "Paid",
      bookingType: "NotRequired",
      timedEntry: true,
      summary: "A Shakespearian classic",
      description: "A contemporary update of this Shakespearian classic",
      descriptionCredit: "Description credit",
      rating: 3,
      minAge: 14,
      maxAge: 18,
      links: [{ type: "Wikipedia", url: "https://en.wikipedia.org/foo" }],
      eventSeries: {
        entityType: "event-series",
        eventSeriesType: "Occasional",
        id: testData.EVENT_EVENT_SERIES_ID,
        name: "Some Event Series",
        occurrence: "Some occurrence",
        status: "Active",
        summary: "A summary",
        description: undefined
      },
      venue: {
        entityType: "venue",
        status: "Active",
        venueType: "Theatre",
        id: testData.EVENT_VENUE_ID,
        name: "Almeida Theatre",
        address: "Islington",
        postcode: "N5 2UA",
        latitude: 53,
        longitude: 2,
        wheelchairAccessType: "FullAccess",
        disabledBathroomType: "Present",
        hearingFacilitiesType: "HearingLoops",
        hasPermanentCollection: false
      },
      venueGuidance: "Through the curtains",
      useVenueOpeningTimes: false,
      openingTimes: [{ day: 6, from: "12:00", to: "16:00" }],
      additionalOpeningTimes: [
        { date: "2016/08/15", from: "17:00", to: "18:00" }
      ],
      duration: "01:00",
      talents: [
        {
          entityType: "talent",
          commonRole: "Foo",
          id: testData.EVENT_TALENT_ID,
          firstNames: "John",
          lastName: "Doe",
          status: "Active",
          talentType: "Individual",
          roles: ["Director"]
        }
      ],
      audienceTags: [{ id: "audience/families", label: "families" }],
      mediumTags: [{ id: "medium/sculpture", label: "sculpture" }],
      styleTags: [{ id: "style/contemporary", label: "contemporary" }],
      geoTags: [
        { id: "geo/europe", label: "europe" },
        { id: "geo/spain", label: "spain" }
      ],
      images: [
        {
          id: "12345678123456781234567812345678",
          ratio: 1.2,
          copyright: "foo"
        }
      ],
      reviews: [{ source: "The Guardian", rating: 4 }],
      weSay: "something",
      version: 4,
      schemeVersion: constants.CURRENT_EVENT_SCHEME_VERSION,
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11"
    });
  });

  it("should not use description from event series", () => {
    const dbItem = testData.createFullPerformanceDbEvent();
    delete dbItem.description;
    delete dbItem.descriptionCredit;

    const referencedEntities = {
      eventSeries: [
        {
          id: testData.EVENT_EVENT_SERIES_ID,
          name: "Some Event Series",
          description: "Series description",
          descriptionCredit: "Series credit"
        }
      ],
      talent: [{ id: testData.EVENT_TALENT_ID, name: "John Doe" }],
      venue: [{ id: testData.EVENT_VENUE_ID, name: "Almeida Theatre" }]
    };

    const result = mappings.mapDbItemToAdminResponse(
      dbItem,
      referencedEntities
    );

    expect(result.description).toEqual(undefined);
    expect(result.descriptionCredit).toEqual(undefined);
  });

  it("should not use images from event series", () => {
    const dbItem = testData.createFullPerformanceDbEvent();
    delete dbItem.images;

    const referencedEntities = {
      eventSeries: [
        {
          id: testData.EVENT_EVENT_SERIES_ID,
          name: "Some Event Series",
          images: [
            { id: "222222222222222222222", ratio: 1.4, copyright: "bar" }
          ]
        }
      ],
      talent: [{ id: testData.EVENT_TALENT_ID, name: "John Doe" }],
      venue: [{ id: testData.EVENT_VENUE_ID, name: "Almeida Theatre" }]
    };

    const result = mappings.mapDbItemToAdminResponse(
      dbItem,
      referencedEntities
    );

    expect(result.images).toEqual(undefined);
  });

  it("should not use images from venue", () => {
    const dbItem = testData.createFullPerformanceDbEvent();
    delete dbItem.images;

    const referencedEntities = {
      eventSeries: [
        { id: testData.EVENT_EVENT_SERIES_ID, name: "Some Event Series" }
      ],
      talent: [{ id: testData.EVENT_TALENT_ID, name: "John Doe" }],
      venue: [
        {
          id: testData.EVENT_VENUE_ID,
          name: "Almeida Theatre",
          images: [{ id: "3333333333333333333", ratio: 1.6, copyright: "bat" }]
        }
      ]
    };

    const result = mappings.mapDbItemToAdminResponse(
      dbItem,
      referencedEntities
    );

    expect(result.images).toEqual(undefined);
  });

  it("should map an event with minimal referenced entities", () => {
    const dbItem = testData.createMinimalPerformanceDbEvent();

    const referencedEntities = {
      venue: [
        {
          entityType: "venue",
          status: "Active",
          venueType: "Theatre",
          id: testData.EVENT_VENUE_ID,
          name: "Almeida Theatre",
          address: "Islington",
          postcode: "N5 2UA",
          latitude: 53,
          longitude: 2,
          wheelchairAccessType: "FullAccess",
          disabledBathroomType: "Present",
          hearingFacilitiesType: "HearingLoops"
        }
      ]
    };

    const result = mappings.mapDbItemToAdminResponse(
      dbItem,
      referencedEntities
    );

    expect(result).toEqual({
      id: testData.PERFORMANCE_EVENT_ID,
      status: "Active",
      name: "Taming of the Shrew",
      eventType: "Performance",
      occurrenceType: "Bounded",
      bookingType: "NotRequired",
      dateFrom: "2016/02/11",
      dateTo: "2016/02/13",
      rating: 3,
      useVenueOpeningTimes: false,
      costType: "Paid",
      summary: "A Shakespearian classic",
      venue: {
        entityType: "venue",
        status: "Active",
        venueType: "Theatre",
        id: testData.EVENT_VENUE_ID,
        name: "Almeida Theatre",
        address: "Islington",
        postcode: "N5 2UA",
        latitude: 53,
        longitude: 2,
        wheelchairAccessType: "FullAccess",
        disabledBathroomType: "Present",
        hearingFacilitiesType: "HearingLoops",
        hasPermanentCollection: false
      },
      version: 4,
      schemeVersion: constants.CURRENT_EVENT_SCHEME_VERSION,
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11"
    });
  });

  it("should throw when a talent is not found", () => {
    const event = {
      id: "some-event",
      eventSeriesId: testData.EVENT_EVENT_SERIES_ID,
      talents: [{ id: "some-other-talent" }],
      venueId: testData.EVENT_VENUE_ID
    };

    const referencedEntities = {
      eventSeries: [{ id: testData.EVENT_EVENT_SERIES_ID }],
      talent: [{ id: testData.EVENT_TALENT_ID }],
      venue: [{ id: testData.EVENT_VENUE_ID }]
    };

    expect(() =>
      mappings.mapDbItemToAdminResponse(event, referencedEntities)
    ).toThrow();
  });
});

describe("mapDbItemToPublicResponse", () => {
  it("should map performance event with all referenced entities", () => {
    const dbItem = testData.createFullPerformanceDbEvent();
    dbItem.talents[0].characters = ["Polonius"];

    const referencedEntities = {
      eventSeries: [
        {
          entityType: "event-series",
          eventSeriesType: "Occasional",
          id: testData.EVENT_EVENT_SERIES_ID,
          name: "Some Event Series",
          occurrence: "Some occurrence",
          status: "Active",
          summary: "A summary"
        }
      ],
      talent: [
        {
          entityType: "talent",
          commonRole: "Foo",
          id: testData.EVENT_TALENT_ID,
          firstNames: "John",
          lastName: "Doe",
          status: "Active",
          talentType: "Individual"
        }
      ],
      venue: [
        {
          entityType: "venue",
          status: "Active",
          venueType: "Theatre",
          id: testData.EVENT_VENUE_ID,
          name: "Almeida Theatre",
          address: "Islington",
          postcode: "N5 2UA",
          latitude: 53,
          longitude: 2,
          wheelchairAccessType: "FullAccess",
          disabledBathroomType: "Present",
          hearingFacilitiesType: "HearingLoops"
        }
      ]
    };

    const result = mappings.mapDbItemToPublicResponse(
      dbItem,
      referencedEntities
    );

    expect(result).toEqual({
      entityType: "event",
      id: testData.PERFORMANCE_EVENT_ID,
      status: "Active",
      name: "Taming of the Shrew",
      eventType: "Performance",
      occurrenceType: "Bounded",
      dateFrom: "2016/02/11",
      dateTo: "2016/02/13",
      costType: "Paid",
      bookingType: "NotRequired",
      soldOut: true,
      summary: "A Shakespearian classic",
      description: "A contemporary update of this Shakespearian classic",
      descriptionCredit: "Description credit",
      rating: 3,
      minAge: 14,
      maxAge: 18,
      links: [{ type: "Wikipedia", url: "https://en.wikipedia.org/foo" }],
      eventSeries: {
        entityType: "event-series",
        eventSeriesType: "Occasional",
        id: testData.EVENT_EVENT_SERIES_ID,
        name: "Some Event Series",
        occurrence: "Some occurrence",
        status: "Active",
        summary: "A summary",
        description: undefined
      },
      venue: {
        entityType: "venue",
        status: "Active",
        venueType: "Theatre",
        id: testData.EVENT_VENUE_ID,
        name: "Almeida Theatre",
        address: "Islington",
        postcode: "N5 2UA",
        latitude: 53,
        longitude: 2,
        wheelchairAccessType: "FullAccess",
        disabledBathroomType: "Present",
        hearingFacilitiesType: "HearingLoops",
        hasPermanentCollection: false
      },
      venueId: "almeida-theatre",
      venueName: "Almeida Theatre",
      postcode: "N5 2UA",
      latitude: 53,
      longitude: 2,
      venueGuidance: "Through the curtains",
      useVenueOpeningTimes: false,
      timesRanges: [
        {
          id: "all-run",
          label: "all run",
          dateFrom: "2016/02/11",
          dateTo: "2016/02/13"
        }
      ],
      performances: [{ day: 6, at: "12:00", timesRangeId: "all-run" }],
      additionalPerformances: [{ date: "2016/08/15", at: "08:00" }],
      duration: "01:00",
      talents: [
        {
          entityType: "talent",
          commonRole: "Foo",
          id: testData.EVENT_TALENT_ID,
          firstNames: "John",
          lastName: "Doe",
          status: "Active",
          talentType: "Individual",
          roles: ["Director"],
          characters: ["Polonius"]
        }
      ],
      audienceTags: [{ id: "audience/families", label: "families" }],
      mediumTags: [{ id: "medium/sculpture", label: "sculpture" }],
      styleTags: [{ id: "style/contemporary", label: "contemporary" }],
      geoTags: [
        { id: "geo/europe", label: "europe" },
        { id: "geo/spain", label: "spain" }
      ],
      images: [
        {
          id: "12345678123456781234567812345678",
          ratio: 1.2,
          copyright: "foo"
        }
      ],
      image: "12345678123456781234567812345678",
      imageRatio: 1.2,
      imageCopyright: "foo",
      reviews: [{ source: "The Guardian", rating: 4 }],
      weSay: "something",
      soldOutPerformances: [{ at: "08:00", date: "2016/08/15" }]
    });
  });

  it("should map exhibition event with all referenced entities", () => {
    const dbItem = testData.createFullExhibitionDbEvent();

    const referencedEntities = {
      eventSeries: [
        {
          entityType: "event-series",
          eventSeriesType: "Occasional",
          id: testData.EVENT_EVENT_SERIES_ID,
          name: "Some Event Series",
          occurrence: "Some occurrence",
          status: "Active",
          summary: "A summary"
        }
      ],
      talent: [
        {
          entityType: "talent",
          commonRole: "Foo",
          id: testData.EVENT_TALENT_ID,
          firstNames: "John",
          lastName: "Doe",
          status: "Active",
          talentType: "Individual"
        }
      ],
      venue: [
        {
          entityType: "venue",
          status: "Active",
          venueType: "Theatre",
          id: testData.EVENT_VENUE_ID,
          name: "Almeida Theatre",
          address: "Islington",
          postcode: "N5 2UA",
          latitude: 53,
          longitude: 2,
          wheelchairAccessType: "FullAccess",
          disabledBathroomType: "Present",
          hearingFacilitiesType: "HearingLoops"
        }
      ]
    };

    const result = mappings.mapDbItemToPublicResponse(
      dbItem,
      referencedEntities
    );

    expect(result).toEqual({
      entityType: "event",
      id: testData.PERFORMANCE_EVENT_ID,
      status: "Active",
      name: "Taming of the Shrew",
      eventType: "Exhibition",
      occurrenceType: "Bounded",
      dateFrom: "2016/02/11",
      dateTo: "2016/02/13",
      costType: "Paid",
      bookingType: "NotRequired",
      timedEntry: true,
      summary: "A Shakespearian classic",
      description: "A contemporary update of this Shakespearian classic",
      descriptionCredit: "Description credit",
      rating: 3,
      minAge: 14,
      maxAge: 18,
      links: [{ type: "Wikipedia", url: "https://en.wikipedia.org/foo" }],
      eventSeries: {
        entityType: "event-series",
        eventSeriesType: "Occasional",
        id: testData.EVENT_EVENT_SERIES_ID,
        name: "Some Event Series",
        occurrence: "Some occurrence",
        status: "Active",
        summary: "A summary",
        description: undefined
      },
      venue: {
        entityType: "venue",
        status: "Active",
        venueType: "Theatre",
        id: testData.EVENT_VENUE_ID,
        name: "Almeida Theatre",
        address: "Islington",
        postcode: "N5 2UA",
        latitude: 53,
        longitude: 2,
        wheelchairAccessType: "FullAccess",
        disabledBathroomType: "Present",
        hearingFacilitiesType: "HearingLoops",
        hasPermanentCollection: false
      },
      venueId: "almeida-theatre",
      venueName: "Almeida Theatre",
      postcode: "N5 2UA",
      latitude: 53,
      longitude: 2,
      venueGuidance: "Through the curtains",
      useVenueOpeningTimes: false,
      openingTimes: [{ day: 6, from: "12:00", to: "16:00" }],
      additionalOpeningTimes: [
        { date: "2016/08/15", from: "17:00", to: "18:00" }
      ],
      duration: "01:00",
      talents: [
        {
          entityType: "talent",
          commonRole: "Foo",
          id: testData.EVENT_TALENT_ID,
          firstNames: "John",
          lastName: "Doe",
          status: "Active",
          talentType: "Individual",
          roles: ["Director"]
        }
      ],
      audienceTags: [{ id: "audience/families", label: "families" }],
      mediumTags: [{ id: "medium/sculpture", label: "sculpture" }],
      styleTags: [{ id: "style/contemporary", label: "contemporary" }],
      geoTags: [
        { id: "geo/europe", label: "europe" },
        { id: "geo/spain", label: "spain" }
      ],
      images: [
        {
          id: "12345678123456781234567812345678",
          ratio: 1.2,
          copyright: "foo"
        }
      ],
      image: "12345678123456781234567812345678",
      imageRatio: 1.2,
      imageCopyright: "foo",
      reviews: [{ source: "The Guardian", rating: 4 }],
      weSay: "something"
    });
  });

  it("should use description from event series", () => {
    const dbItem = testData.createFullPerformanceDbEvent();
    delete dbItem.description;

    const referencedEntities = {
      eventSeries: [
        {
          id: testData.EVENT_EVENT_SERIES_ID,
          name: "Some Event Series",
          description: "Series description",
          descriptionCredit: "Series credit"
        }
      ],
      talent: [{ id: testData.EVENT_TALENT_ID, name: "John Doe" }],
      venue: [{ id: testData.EVENT_VENUE_ID, name: "Almeida Theatre" }]
    };

    const result = mappings.mapDbItemToPublicResponse(
      dbItem,
      referencedEntities
    );

    expect(result.description).toEqual("Series description");
    expect(result.descriptionCredit).toEqual("Series credit");
  });

  it("should use images from event series", () => {
    const dbItem = testData.createFullPerformanceDbEvent();
    delete dbItem.images;

    const referencedEntities = {
      eventSeries: [
        {
          id: testData.EVENT_EVENT_SERIES_ID,
          name: "Some Event Series",
          images: [{ id: "222222222222222222", ratio: 1.4, copyright: "bar" }]
        }
      ],
      talent: [{ id: testData.EVENT_TALENT_ID, name: "John Doe" }],
      venue: [{ id: testData.EVENT_VENUE_ID, name: "Almeida Theatre" }]
    };

    const result = mappings.mapDbItemToPublicResponse(
      dbItem,
      referencedEntities
    );

    expect(result.images).toEqual([
      { id: "222222222222222222", ratio: 1.4, copyright: "bar" }
    ]);

    expect(result.image).toEqual("222222222222222222");
    expect(result.imageRatio).toEqual(1.4);
    expect(result.imageCopyright).toEqual("bar");
  });

  it("should use images from venue", () => {
    const dbItem = testData.createFullPerformanceDbEvent();
    delete dbItem.images;

    const referencedEntities = {
      eventSeries: [
        { id: testData.EVENT_EVENT_SERIES_ID, name: "Some Event Series" }
      ],
      talent: [{ id: testData.EVENT_TALENT_ID, name: "John Doe" }],
      venue: [
        {
          id: testData.EVENT_VENUE_ID,
          name: "Almeida Theatre",
          images: [{ id: "333333333333333", ratio: 1.6, copyright: "bat" }]
        }
      ]
    };

    const result = mappings.mapDbItemToPublicResponse(
      dbItem,
      referencedEntities
    );

    expect(result.images).toEqual([
      { id: "333333333333333", ratio: 1.6, copyright: "bat" }
    ]);

    expect(result.image).toEqual("333333333333333");
    expect(result.imageRatio).toEqual(1.6);
    expect(result.imageCopyright).toEqual("bat");
  });

  it("should map an event with minimal referenced entities", () => {
    const dbItem = testData.createMinimalPerformanceDbEvent();

    const referencedEntities = {
      venue: [
        {
          id: testData.EVENT_VENUE_ID,
          status: "Active",
          name: "Almeida Theatre",
          address: "Islington",
          postcode: "N5 2UA",
          latitude: 53,
          longitude: 2,
          venueType: "Theatre",
          wheelchairAccessType: "FullAccess",
          disabledBathroomType: "Present",
          hearingFacilitiesType: "HearingLoops"
        }
      ]
    };

    const result = mappings.mapDbItemToPublicResponse(
      dbItem,
      referencedEntities
    );

    expect(result).toEqual({
      entityType: "event",
      id: testData.PERFORMANCE_EVENT_ID,
      status: "Active",
      name: "Taming of the Shrew",
      eventType: "Performance",
      occurrenceType: "Bounded",
      bookingType: "NotRequired",
      dateFrom: "2016/02/11",
      dateTo: "2016/02/13",
      rating: 3,
      useVenueOpeningTimes: false,
      costType: "Paid",
      summary: "A Shakespearian classic",
      venue: {
        entityType: "venue",
        status: "Active",
        id: testData.EVENT_VENUE_ID,
        name: "Almeida Theatre",
        address: "Islington",
        postcode: "N5 2UA",
        latitude: 53,
        longitude: 2,
        venueType: "Theatre",
        wheelchairAccessType: "FullAccess",
        disabledBathroomType: "Present",
        hearingFacilitiesType: "HearingLoops",
        hasPermanentCollection: false
      },
      venueId: "almeida-theatre",
      venueName: "Almeida Theatre",
      postcode: "N5 2UA",
      latitude: 53,
      longitude: 2
    });
  });

  it("should throw when a talent is not found", () => {
    const event = {
      id: "some-event",
      eventSeriesId: testData.EVENT_EVENT_SERIES_ID,
      venueId: testData.EVENT_VENUE_ID,
      talents: [{ id: "some-other-talent" }]
    };

    const referencedEntities = {
      eventSeries: [{ id: testData.EVENT_EVENT_SERIES_ID }],
      talent: [{ id: testData.EVENT_TALENT_ID }],
      venue: [{ id: testData.EVENT_VENUE_ID }]
    };

    expect(() =>
      mappings.mapDbItemToPublicResponse(event, referencedEntities)
    ).toThrow();
  });
});

describe("mapDbItemToPublicSummaryResponse", () => {
  it("should map a fully populated performance with all referenced entities", () => {
    const dbItem = testData.createFullPerformanceDbEvent();

    const referencedEntities = {
      eventSeries: [
        { id: testData.EVENT_EVENT_SERIES_ID, name: "Some Event Series" }
      ],
      talent: [{ id: testData.EVENT_TALENT_ID, name: "John Doe" }],
      venue: [
        {
          id: testData.EVENT_VENUE_ID,
          name: "Almeida Theatre",
          postcode: "N5 2UA",
          latitude: 53,
          longitude: 2
        }
      ]
    };

    const result = mappings.mapDbItemToPublicSummaryResponse(
      dbItem,
      referencedEntities
    );

    expect(result).toEqual({
      entityType: "event",
      id: testData.PERFORMANCE_EVENT_ID,
      status: "Active",
      name: "Taming of the Shrew",
      eventType: "Performance",
      occurrenceType: "Bounded",
      soldOut: true,
      costType: "Paid",
      dateFrom: "2016/02/11",
      dateTo: "2016/02/13",
      summary: "A Shakespearian classic",
      venueId: "almeida-theatre",
      venueName: "Almeida Theatre",
      postcode: "N5 2UA",
      latitude: 53,
      longitude: 2,
      image: "12345678123456781234567812345678",
      imageCopyright: "foo",
      imageRatio: 1.2
    });
  });

  it("should map a minimally populated performance with minimal referenced entities", () => {
    const dbItem = testData.createMinimalPerformanceDbEvent();

    const referencedEntities = {
      venue: [
        {
          id: testData.EVENT_VENUE_ID,
          name: "Almeida Theatre",
          postcode: "N5 2UA",
          latitude: 53,
          longitude: 2
        }
      ]
    };

    const result = mappings.mapDbItemToPublicSummaryResponse(
      dbItem,
      referencedEntities
    );

    expect(result).toEqual({
      entityType: "event",
      id: testData.PERFORMANCE_EVENT_ID,
      status: "Active",
      name: "Taming of the Shrew",
      eventType: "Performance",
      occurrenceType: "Bounded",
      costType: "Paid",
      dateFrom: "2016/02/11",
      dateTo: "2016/02/13",
      summary: "A Shakespearian classic",
      venueId: "almeida-theatre",
      venueName: "Almeida Theatre",
      postcode: "N5 2UA",
      latitude: 53,
      longitude: 2
    });
  });
});
