import * as testData from "../../tests/utils/test-data";
import * as mapper from "./mapper";
import * as timeUtils from "../entity/time-utils";
import * as bookingType from "../types/booking-type";
import * as costType from "../types/cost-type";
import * as disabledBathroomType from "../types/disabled-bathroom-type";
import * as entityType from "../types/entity-type";
import * as eventSeriesType from "../types/event-series-type";
import * as eventType from "../types/event-type";
import * as hearingFacilitiesType from "../types/hearing-facilities-type";
import * as linkType from "../types/link-type";
import * as occurrenceType from "../types/occurrence-type";
import * as statusType from "../types/status-type";
import * as talentType from "../types/talent-type";
import * as venueType from "../types/venue-type";
import * as wheelchairAccessType from "../types/wheelchair-access-type";

describe("mapCreateOrUpdateEventRequest", () => {
  beforeEach(() => {
    timeUtils.getCreatedDateForDB = jest.fn().mockReturnValue("2016-01-11");
  });

  it("should map a minimal performance event", () => {
    const params = testData.createMinimalPerformanceRequestEvent();

    const result = mapper.mapCreateOrUpdateEventRequest({
      ...params,
      id: testData.PERFORMANCE_EVENT_ID
    });

    expect(result).toEqual({
      id: testData.PERFORMANCE_EVENT_ID,
      status: statusType.ACTIVE,
      name: "Taming of the Shrew",
      eventType: eventType.PERFORMANCE,
      occurrenceType: occurrenceType.BOUNDED,
      bookingType: bookingType.NOT_REQUIRED,
      dateFrom: "2016-02-11",
      dateTo: "2016-02-13",
      rating: 3,
      useVenueOpeningTimes: false,
      costType: costType.FREE,
      summary: "A Shakespearian classic",
      venueId: testData.EVENT_VENUE_ID,
      version: 4,
      schemeVersion: mapper.CURRENT_EVENT_SCHEME_VERSION,
      createdDate: "2016-01-10",
      updatedDate: "2016-01-11"
    });
  });

  it("should map a fully populated performance event", () => {
    const params = testData.createFullPerformanceRequestEvent();
    params.talents[0].characters = ["Polonius"];

    const result = mapper.mapCreateOrUpdateEventRequest({
      ...params,
      id: testData.PERFORMANCE_EVENT_ID
    });

    expect(result).toEqual({
      id: testData.PERFORMANCE_EVENT_ID,
      status: statusType.ACTIVE,
      name: "Taming of the Shrew",
      eventType: eventType.PERFORMANCE,
      occurrenceType: occurrenceType.BOUNDED,
      dateFrom: "2016-02-11",
      dateTo: "2016-02-13",
      costType: costType.PAID,
      costFrom: 15.5,
      costTo: 35,
      bookingType: bookingType.REQUIRED_FOR_NON_MEMBERS,
      bookingOpens: "2016-02-11",
      summary: "A contemporary update of this Shakespeare classic",
      description:
        "A contemporary update of this Shakespeare classic by the acclaimed director Sam Mendes.",
      descriptionCredit: "Some credit",
      rating: 4,
      minAge: 14,
      maxAge: 18,
      links: [
        { type: linkType.WIKIPEDIA, url: "https://en.wikipedia.org/foo" }
      ],
      eventSeriesId: testData.EVENT_EVENT_SERIES_ID,
      venueId: testData.EVENT_VENUE_ID,
      venueGuidance:
        "Exhibition is located in the Purcell Room in the Foster Building",
      useVenueOpeningTimes: false,
      timesRanges: [
        {
          id: "all-run",
          label: "all run",
          dateFrom: "2016-02-11",
          dateTo: "2016-02-13"
        }
      ],
      performances: [{ day: 1, at: "18:00", timesRangeId: "all-run" }],
      additionalPerformances: [{ date: "2016-02-11", at: "15:00" }],
      specialPerformances: [
        {
          date: "2016-02-11",
          at: "15:00",
          audienceTags: [{ id: "audience/adult", label: "Adult" }]
        }
      ],
      performancesClosures: [{ date: "2016-12-25" }],
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
      soldOutPerformances: [{ at: "15:00", date: "2016-02-11" }],
      soldOut: false,
      version: 1,
      schemeVersion: mapper.CURRENT_EVENT_SCHEME_VERSION,
      createdDate: "2016-01-10",
      updatedDate: "2016-01-11"
    });
  });

  it("should map a fully populated exhibition event that does not use venue opening times", () => {
    const params = testData.createFullExhibitionRequestEvent();
    params.useVenueOpeningTimes = false;
    params.talents[0].characters = ["Polonius"];

    const result = mapper.mapCreateOrUpdateEventRequest({
      ...params,
      id: testData.EXHIBITION_EVENT_ID
    });

    expect(result).toEqual({
      id: testData.EXHIBITION_EVENT_ID,
      status: statusType.ACTIVE,
      name: "Taming of the Shrew",
      eventType: eventType.EXHIBITION,
      occurrenceType: occurrenceType.BOUNDED,
      dateFrom: "2016-02-11",
      dateTo: "2016-02-13",
      costType: costType.PAID,
      costFrom: 0,
      costTo: 35,
      timedEntry: true,
      bookingType: bookingType.REQUIRED_FOR_NON_MEMBERS,
      bookingOpens: "2016-02-11",
      summary: "A contemporary update of this Shakespeare classic",
      description:
        "A contemporary update of this Shakespeare classic by the acclaimed director Sam Mendes.",
      descriptionCredit: "Some credit",
      rating: 4,
      minAge: 14,
      maxAge: 18,
      links: [
        { type: linkType.WIKIPEDIA, url: "https://en.wikipedia.org/foo" }
      ],
      eventSeriesId: testData.EVENT_EVENT_SERIES_ID,
      venueId: testData.EVENT_VENUE_ID,
      venueGuidance:
        "Exhibition is located in the Purcell Room in the Foster Building",
      useVenueOpeningTimes: false,
      openingTimes: [{ day: 1, from: "09:00", to: "18:00" }],
      additionalOpeningTimes: [
        { date: "2016-02-11", from: "09:00", to: "18:00" }
      ],
      openingTimesClosures: [{ date: "2016-12-25" }],
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
      schemeVersion: mapper.CURRENT_EVENT_SCHEME_VERSION,
      createdDate: "2016-01-10",
      updatedDate: "2016-01-11"
    });
  });

  it("should map a fully populated exhibition event that uses the venue opening times", () => {
    const params = testData.createFullExhibitionRequestEvent();
    params.useVenueOpeningTimes = true;

    const result = mapper.mapCreateOrUpdateEventRequest({
      ...params,
      id: testData.EXHIBITION_EVENT_ID
    });

    expect(result).toEqual({
      id: testData.EXHIBITION_EVENT_ID,
      status: statusType.ACTIVE,
      name: "Taming of the Shrew",
      eventType: eventType.EXHIBITION,
      occurrenceType: occurrenceType.BOUNDED,
      dateFrom: "2016-02-11",
      dateTo: "2016-02-13",
      costType: costType.PAID,
      costFrom: 0,
      costTo: 35,
      timedEntry: true,
      bookingType: bookingType.REQUIRED_FOR_NON_MEMBERS,
      bookingOpens: "2016-02-11",
      summary: "A contemporary update of this Shakespeare classic",
      description:
        "A contemporary update of this Shakespeare classic by the acclaimed director Sam Mendes.",
      descriptionCredit: "Some credit",
      rating: 4,
      minAge: 14,
      maxAge: 18,
      links: [
        { type: linkType.WIKIPEDIA, url: "https://en.wikipedia.org/foo" }
      ],
      eventSeriesId: testData.EVENT_EVENT_SERIES_ID,
      venueId: testData.EVENT_VENUE_ID,
      venueGuidance:
        "Exhibition is located in the Purcell Room in the Foster Building",
      useVenueOpeningTimes: true,
      additionalOpeningTimes: [
        { date: "2016-02-11", from: "09:00", to: "18:00" }
      ],
      openingTimesClosures: [{ date: "2016-12-25" }],
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
      schemeVersion: mapper.CURRENT_EVENT_SCHEME_VERSION,
      createdDate: "2016-01-10",
      updatedDate: "2016-01-11"
    });
  });
});

describe("mapToPublicFullResponse", () => {
  it("should map performance event with all referenced entities", () => {
    const dbItem = testData.createFullPerformanceDbEvent();
    dbItem.talents[0].characters = ["Polonius"];

    const referencedEntities = {
      eventSeries: {
        entityType: entityType.EVENT_SERIES,
        eventSeriesType: eventSeriesType.OCCASIONAL,
        id: testData.EVENT_EVENT_SERIES_ID,
        name: "Some Event Series",
        occurrence: "Some occurrence",
        status: statusType.ACTIVE,
        summary: "A summary"
      },
      talents: [
        {
          entityType: entityType.TALENT,
          commonRole: "Foo",
          id: testData.EVENT_TALENT_ID,
          firstNames: "John",
          lastName: "Doe",
          status: statusType.ACTIVE,
          talentType: talentType.INDIVIDUAL
        }
      ],
      venue: {
        entityType: entityType.VENUE,
        status: statusType.ACTIVE,
        venueType: venueType.THEATRE,
        id: testData.EVENT_VENUE_ID,
        name: "Almeida Theatre",
        address: "Islington",
        postcode: "N5 2UA",
        latitude: 53,
        longitude: 2,
        wheelchairAccessType: wheelchairAccessType.FULL_ACCESS,
        disabledBathroomType: disabledBathroomType.PRESENT,
        hearingFacilitiesType: hearingFacilitiesType.HEARING_LOOPS
      }
    };

    const event = mapper.mergeReferencedEntities(dbItem, referencedEntities);
    const result = mapper.mapToPublicFullResponse(event);

    expect(result).toEqual({
      entityType: entityType.EVENT,
      isFullEntity: true,
      id: testData.PERFORMANCE_EVENT_ID,
      status: statusType.ACTIVE,
      name: "Taming of the Shrew",
      eventType: eventType.PERFORMANCE,
      occurrenceType: occurrenceType.BOUNDED,
      dateFrom: "2016-02-11",
      dateTo: "2016-02-13",
      costType: costType.PAID,
      bookingType: bookingType.NOT_REQUIRED,
      soldOut: true,
      summary: "A Shakespearian classic",
      description: "A contemporary update of this Shakespearian classic",
      descriptionCredit: "Description credit",
      rating: 3,
      minAge: 14,
      maxAge: 18,
      links: [
        { type: linkType.WIKIPEDIA, url: "https://en.wikipedia.org/foo" }
      ],
      eventSeries: {
        entityType: entityType.EVENT_SERIES,
        eventSeriesType: eventSeriesType.OCCASIONAL,
        id: testData.EVENT_EVENT_SERIES_ID,
        name: "Some Event Series",
        occurrence: "Some occurrence",
        status: statusType.ACTIVE,
        summary: "A summary"
      },
      venue: {
        entityType: entityType.VENUE,
        status: statusType.ACTIVE,
        venueType: venueType.THEATRE,
        id: testData.EVENT_VENUE_ID,
        name: "Almeida Theatre",
        address: "Islington",
        postcode: "N5 2UA",
        latitude: 53,
        longitude: 2,
        wheelchairAccessType: wheelchairAccessType.FULL_ACCESS,
        disabledBathroomType: disabledBathroomType.PRESENT,
        hearingFacilitiesType: hearingFacilitiesType.HEARING_LOOPS
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
          dateFrom: "2016-02-11",
          dateTo: "2016-02-13"
        }
      ],
      performances: [{ day: 7, at: "12:00", timesRangeId: "all-run" }],
      additionalPerformances: [{ date: "2016-08-15", at: "08:00" }],
      duration: "01:00",
      talents: [
        {
          entityType: entityType.TALENT,
          commonRole: "Foo",
          id: testData.EVENT_TALENT_ID,
          firstNames: "John",
          lastName: "Doe",
          status: statusType.ACTIVE,
          talentType: talentType.INDIVIDUAL,
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
      soldOutPerformances: [{ at: "08:00", date: "2016-08-15" }],
      version: 4
    });
  });

  it("should map exhibition event with all referenced entities", () => {
    const dbItem = testData.createFullExhibitionDbEvent();

    const referencedEntities = {
      eventSeries: {
        entityType: entityType.EVENT_SERIES,
        eventSeriesType: eventSeriesType.OCCASIONAL,
        id: testData.EVENT_EVENT_SERIES_ID,
        name: "Some Event Series",
        occurrence: "Some occurrence",
        status: statusType.ACTIVE,
        summary: "A summary"
      },
      talents: [
        {
          entityType: entityType.TALENT,
          commonRole: "Foo",
          id: testData.EVENT_TALENT_ID,
          firstNames: "John",
          lastName: "Doe",
          status: statusType.ACTIVE,
          talentType: talentType.INDIVIDUAL
        }
      ],
      venue: {
        entityType: entityType.VENUE,
        status: statusType.ACTIVE,
        venueType: venueType.THEATRE,
        id: testData.EVENT_VENUE_ID,
        name: "Almeida Theatre",
        address: "Islington",
        postcode: "N5 2UA",
        latitude: 53,
        longitude: 2,
        wheelchairAccessType: wheelchairAccessType.FULL_ACCESS,
        disabledBathroomType: disabledBathroomType.PRESENT,
        hearingFacilitiesType: hearingFacilitiesType.HEARING_LOOPS
      }
    };

    const event = mapper.mergeReferencedEntities(dbItem, referencedEntities);
    const result = mapper.mapToPublicFullResponse(event);

    expect(result).toEqual({
      entityType: entityType.EVENT,
      isFullEntity: true,
      id: testData.PERFORMANCE_EVENT_ID,
      status: statusType.ACTIVE,
      name: "Taming of the Shrew",
      eventType: eventType.EXHIBITION,
      occurrenceType: occurrenceType.BOUNDED,
      dateFrom: "2016-02-11",
      dateTo: "2016-02-13",
      costType: costType.PAID,
      bookingType: bookingType.NOT_REQUIRED,
      timedEntry: true,
      summary: "A Shakespearian classic",
      description: "A contemporary update of this Shakespearian classic",
      descriptionCredit: "Description credit",
      rating: 3,
      minAge: 14,
      maxAge: 18,
      links: [
        { type: linkType.WIKIPEDIA, url: "https://en.wikipedia.org/foo" }
      ],
      eventSeries: {
        entityType: entityType.EVENT_SERIES,
        eventSeriesType: eventSeriesType.OCCASIONAL,
        id: testData.EVENT_EVENT_SERIES_ID,
        name: "Some Event Series",
        occurrence: "Some occurrence",
        status: statusType.ACTIVE,
        summary: "A summary"
      },
      venue: {
        entityType: entityType.VENUE,
        status: statusType.ACTIVE,
        venueType: venueType.THEATRE,
        id: testData.EVENT_VENUE_ID,
        name: "Almeida Theatre",
        address: "Islington",
        postcode: "N5 2UA",
        latitude: 53,
        longitude: 2,
        wheelchairAccessType: wheelchairAccessType.FULL_ACCESS,
        disabledBathroomType: disabledBathroomType.PRESENT,
        hearingFacilitiesType: hearingFacilitiesType.HEARING_LOOPS
      },
      venueId: "almeida-theatre",
      venueName: "Almeida Theatre",
      postcode: "N5 2UA",
      latitude: 53,
      longitude: 2,
      venueGuidance: "Through the curtains",
      useVenueOpeningTimes: false,
      openingTimes: [{ day: 7, from: "12:00", to: "16:00" }],
      additionalOpeningTimes: [
        { date: "2016-08-15", from: "17:00", to: "18:00" }
      ],
      duration: "01:00",
      talents: [
        {
          entityType: entityType.TALENT,
          commonRole: "Foo",
          id: testData.EVENT_TALENT_ID,
          firstNames: "John",
          lastName: "Doe",
          status: statusType.ACTIVE,
          talentType: talentType.INDIVIDUAL,
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
      weSay: "something",
      version: 4
    });
  });

  it("should use description from event series", () => {
    const dbItem = testData.createFullPerformanceDbEvent();
    delete dbItem.description;

    const referencedEntities = {
      eventSeries: {
        id: testData.EVENT_EVENT_SERIES_ID,
        name: "Some Event Series",
        description: "Series description",
        descriptionCredit: "Series credit"
      },
      talents: [{ id: testData.EVENT_TALENT_ID, name: "John Doe" }],
      venue: { id: testData.EVENT_VENUE_ID, name: "Almeida Theatre" }
    };

    const event = mapper.mergeReferencedEntities(dbItem, referencedEntities);
    const result = mapper.mapToPublicFullResponse(event);

    expect(result.description).toEqual("Series description");
    expect(result.descriptionCredit).toEqual("Series credit");
  });

  it("should use images from event series", () => {
    const dbItem = testData.createFullPerformanceDbEvent();
    delete dbItem.images;

    const referencedEntities = {
      eventSeries: {
        id: testData.EVENT_EVENT_SERIES_ID,
        name: "Some Event Series",
        images: [{ id: "222222222222222222", ratio: 1.4, copyright: "bar" }]
      },
      talents: [{ id: testData.EVENT_TALENT_ID, name: "John Doe" }],
      venue: { id: testData.EVENT_VENUE_ID, name: "Almeida Theatre" }
    };

    const event = mapper.mergeReferencedEntities(dbItem, referencedEntities);
    const result = mapper.mapToPublicFullResponse(event);

    expect(result.images).toEqual([
      { id: "222222222222222222", ratio: 1.4, copyright: "bar" }
    ]);

    expect(result.image).toEqual("222222222222222222");
    expect(result.imageRatio).toEqual(1.4);
    expect(result.imageCopyright).toEqual("bar");
  });
});
