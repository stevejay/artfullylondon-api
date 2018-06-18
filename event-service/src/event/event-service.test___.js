"use strict";

const dynamodb = require("../external-services/dynamodb");
const testData = require("../test-data");
const eventService = require("./event-service");
const populate = require("./populate");
const entity = require("../entity/entity");
const eventConstants = require("./constants");
const sns = require("../external-services/sns");
const date = require("../date");

process.env.SERVERLESS_EVENT_TABLE_NAME = "event-table";
process.env.SERVERLESS_VENUE_TABLE_NAME = "venue-table";
process.env.SERVERLESS_EVENT_UPDATED_TOPIC_ARN = "event-updated";

const sync = fn =>
  fn.then(res => () => res).catch(err => () => {
    throw err;
  });

describe("createOrUpdateEvent", () => {
  beforeEach(() => {
    date.getTodayAsStringDate = jest.fn().mockReturnValue("2016/01/11");
  });

  it("should throw when request is invalid", async () => {
    expect(
      await sync(eventService.createOrUpdateEvent(null, { status: "Foo" }))
    ).toThrow();
  });

  it("should process create event request", async () => {
    populate.getReferencedEntities = jest.fn().mockResolvedValue({
      venue: [testData.createMinimalDbVenue()],
      talent: [],
      eventSeries: []
    });

    entity.write = jest.fn().mockResolvedValue();
    sns.notify = jest.fn().mockResolvedValue();

    const response = await eventService.createOrUpdateEvent(null, {
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
      description: "A contemporary update of this Shakespearian classic",
      venueId: testData.MINIMAL_VENUE_ID,
      version: 1,
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11"
    });

    expect(response).toEqual({
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
      description: "A contemporary update of this Shakespearian classic",
      version: 1,
      schemeVersion: eventConstants.CURRENT_EVENT_SCHEME_VERSION,
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11",
      venue: {
        entityType: "venue",
        address: "Almeida St\nIslington",
        id: "almeida-theatre",
        latitude: 51.539464,
        longitude: -0.103103,
        name: "Almeida Theatre",
        postcode: "N1 1TA",
        status: "Active",
        venueType: "Theatre",
        disabledBathroomType: "Present",
        hearingFacilitiesType: "HearingLoops",
        wheelchairAccessType: "FullAccess",
        hasPermanentCollection: false
      }
    });

    const dbItem = {
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
      description: "A contemporary update of this Shakespearian classic",
      venueId: testData.MINIMAL_VENUE_ID,
      version: 1,
      schemeVersion: eventConstants.CURRENT_EVENT_SCHEME_VERSION,
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11"
    };

    expect(populate.getReferencedEntities).toHaveBeenCalledWith(dbItem);

    expect(entity.write).toHaveBeenCalledWith(
      process.env.SERVERLESS_EVENT_TABLE_NAME,
      dbItem
    );

    expect(sns.notify).toHaveBeenCalledWith(
      { eventId: testData.PERFORMANCE_EVENT_ID },
      { arn: "event-updated" }
    );
  });

  it("should process update event request", async () => {
    populate.getReferencedEntities = jest.fn().mockResolvedValue({
      venue: [testData.createMinimalDbVenue()],
      talent: [],
      eventSeries: []
    });

    entity.write = jest.fn().mockResolvedValue();
    sns.notify = jest.fn().mockResolvedValue();

    const response = await eventService.createOrUpdateEvent(
      "almeida-theatre/2016/taming-of-the-shrew",
      {
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
        description: "A contemporary update of this Shakespearian classic",
        venueId: testData.MINIMAL_VENUE_ID,
        version: 3,
        createdDate: "2016/01/10",
        updatedDate: "2016/01/11"
      }
    );

    expect(response).toEqual({
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
      description: "A contemporary update of this Shakespearian classic",
      version: 3,
      schemeVersion: eventConstants.CURRENT_EVENT_SCHEME_VERSION,
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11",
      venue: {
        entityType: "venue",
        address: "Almeida St\nIslington",
        id: "almeida-theatre",
        latitude: 51.539464,
        longitude: -0.103103,
        name: "Almeida Theatre",
        postcode: "N1 1TA",
        status: "Active",
        venueType: "Theatre",
        disabledBathroomType: "Present",
        hearingFacilitiesType: "HearingLoops",
        wheelchairAccessType: "FullAccess",
        hasPermanentCollection: false
      }
    });

    const dbItem = {
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
      description: "A contemporary update of this Shakespearian classic",
      venueId: testData.MINIMAL_VENUE_ID,
      version: 3,
      schemeVersion: eventConstants.CURRENT_EVENT_SCHEME_VERSION,
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11"
    };

    expect(populate.getReferencedEntities).toHaveBeenCalledWith(dbItem);

    expect(entity.write).toHaveBeenCalledWith(
      process.env.SERVERLESS_EVENT_TABLE_NAME,
      dbItem
    );

    expect(sns.notify).toHaveBeenCalledWith(
      { eventId: testData.PERFORMANCE_EVENT_ID },
      { arn: "event-updated" }
    );
  });
});

describe("getEventForEdit", () => {
  it("should process get request with minimal related entities", async () => {
    const dbItem = testData.createMinimalPerformanceDbEvent();
    dbItem.venueId = testData.MINIMAL_VENUE_ID;
    entity.get = jest.fn().mockResolvedValue(dbItem);

    populate.getReferencedEntities = jest.fn().mockResolvedValue({
      venue: [testData.createMinimalDbVenue()],
      talent: [],
      eventSeries: []
    });

    const response = await eventService.getEventForEdit(
      "almeida-theatre/2016/taming-of-the-shrew"
    );

    expect(response).toEqual({
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
        id: testData.MINIMAL_VENUE_ID,
        name: "Almeida Theatre",
        status: "Active",
        venueType: "Theatre",
        address: "Almeida St\nIslington",
        postcode: "N1 1TA",
        latitude: 51.539464,
        longitude: -0.103103,
        wheelchairAccessType: "FullAccess",
        disabledBathroomType: "Present",
        hearingFacilitiesType: "HearingLoops",
        hasPermanentCollection: false
      },
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11",
      schemeVersion: eventConstants.CURRENT_EVENT_SCHEME_VERSION,
      version: 4
    });

    expect(entity.get).toHaveBeenCalledWith(
      process.env.SERVERLESS_EVENT_TABLE_NAME,
      "almeida-theatre/2016/taming-of-the-shrew",
      true
    );

    expect(populate.getReferencedEntities).toHaveBeenCalledWith(dbItem);
  });

  it("should process get request with all related entities", async () => {
    const dbItem = testData.createMinimalPerformanceDbEvent();
    dbItem.venueId = testData.MINIMAL_VENUE_ID;
    dbItem.eventSeriesId = testData.EVENT_SERIES_ID;
    dbItem.talents = [{ id: testData.INDIVIDUAL_TALENT_ID, roles: ["Actor"] }];
    entity.get = jest.fn().mockResolvedValue(dbItem);

    populate.getReferencedEntities = jest.fn().mockResolvedValue({
      venue: [testData.createMinimalDbVenue()],
      talent: [testData.createMinimalIndividualDbTalent()],
      eventSeries: [testData.createMinimalDbEventSeries()]
    });

    const response = await eventService.getEventForEdit(
      "almeida-theatre/2016/taming-of-the-shrew"
    );

    expect(response).toEqual({
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
        id: testData.MINIMAL_VENUE_ID,
        name: "Almeida Theatre",
        status: "Active",
        venueType: "Theatre",
        address: "Almeida St\nIslington",
        postcode: "N1 1TA",
        latitude: 51.539464,
        longitude: -0.103103,
        wheelchairAccessType: "FullAccess",
        disabledBathroomType: "Present",
        hearingFacilitiesType: "HearingLoops",
        hasPermanentCollection: false
      },
      eventSeries: {
        entityType: "event-series",
        id: testData.EVENT_SERIES_ID,
        name: "Bang Said The Gun",
        status: "Active",
        eventSeriesType: "Occasional",
        occurrence: "Third Thursday of each month",
        summary: "A poetry riot",
        description: "Poetry for people who dont like poetry."
      },
      talents: [
        {
          entityType: "talent",
          id: testData.INDIVIDUAL_TALENT_ID,
          firstNames: "Carrie",
          lastName: "Cracknell",
          status: "Active",
          talentType: "Individual",
          commonRole: "Actor",
          roles: ["Actor"]
        }
      ],
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11",
      schemeVersion: eventConstants.CURRENT_EVENT_SCHEME_VERSION,
      version: 4
    });

    expect(entity.get).toHaveBeenCalledWith(
      process.env.SERVERLESS_EVENT_TABLE_NAME,
      "almeida-theatre/2016/taming-of-the-shrew",
      true
    );

    expect(populate.getReferencedEntities).toHaveBeenCalledWith(dbItem);
  });
});

describe("getEventMulti", () => {
  it("should process get multiple request", async () => {
    dynamodb.batchGet = jest.fn().mockResolvedValue({
      Responses: {
        [process.env.SERVERLESS_VENUE_TABLE_NAME]: [
          {
            id: "tate-modern/2016/tate-modern-permanent-collection",
            venueId: testData.MINIMAL_VENUE_ID,
            eventSeriesId: testData.EVENT_SERIES_ID
          },
          {
            id: "serpentine-sackler-gallery/2016/zaha-hadid",
            venueId: testData.MINIMAL_VENUE_ID
          }
        ]
      }
    });

    populate.getReferencedEntitiesForSearch = jest.fn().mockResolvedValue([
      {
        entity: { id: "tate-modern/2016/tate-modern-permanent-collection" },
        referencedEntities: {
          eventSeries: [
            {
              id: testData.EVENT_SERIES_ID
            }
          ],
          venue: [
            {
              id: testData.MINIMAL_VENUE_ID
            }
          ]
        }
      },
      {
        entity: { id: "serpentine-sackler-gallery/2016/zaha-hadid" },
        referencedEntities: {
          venue: [
            {
              id: testData.MINIMAL_VENUE_ID
            }
          ]
        }
      }
    ]);

    const response = await eventService.getEventMulti([
      "tate-modern/2016/tate-modern-permanent-collection",
      "serpentine-sackler-gallery/2016/zaha-hadid"
    ]);

    expect(response).toEqual(
      expect.arrayContaining([
        {
          entityType: "event",
          id: "tate-modern/2016/tate-modern-permanent-collection",
          venueId: "almeida-theatre"
        },
        {
          entityType: "event",
          id: "serpentine-sackler-gallery/2016/zaha-hadid",
          venueId: "almeida-theatre"
        }
      ])
    );
  });
});

describe("getEvent", () => {
  it("should process a get event request with minimal related entities", async () => {
    const dbItem = testData.createMinimalPerformanceDbEvent();
    dbItem.venueId = testData.MINIMAL_VENUE_ID;
    entity.get = jest.fn().mockResolvedValue(dbItem);

    populate.getReferencedEntities = jest.fn().mockResolvedValue({
      venue: [testData.createMinimalDbVenue()],
      talent: [],
      eventSeries: []
    });

    const response = await eventService.getEvent(
      "almeida-theatre/2016/taming-of-the-shrew",
      false
    );

    expect(response).toEqual({
      entityType: "event",
      isFullEntity: true,
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
      venueId: testData.EVENT_VENUE_ID,
      venueName: "Almeida Theatre",
      postcode: "N1 1TA",
      latitude: 51.539464,
      longitude: -0.103103,
      venue: {
        entityType: "venue",
        id: testData.MINIMAL_VENUE_ID,
        name: "Almeida Theatre",
        status: "Active",
        venueType: "Theatre",
        address: "Almeida St\nIslington",
        postcode: "N1 1TA",
        latitude: 51.539464,
        longitude: -0.103103,
        wheelchairAccessType: "FullAccess",
        disabledBathroomType: "Present",
        hearingFacilitiesType: "HearingLoops",
        hasPermanentCollection: false
      }
    });

    expect(entity.get).toHaveBeenCalledWith(
      process.env.SERVERLESS_EVENT_TABLE_NAME,
      "almeida-theatre/2016/taming-of-the-shrew",
      false
    );

    expect(populate.getReferencedEntities).toHaveBeenCalledWith(dbItem);
  });

  it("should process a get event request with all related entities", async () => {
    const dbItem = testData.createMinimalPerformanceDbEvent();
    dbItem.venueId = testData.MINIMAL_VENUE_ID;
    dbItem.eventSeriesId = testData.EVENT_SERIES_ID;
    dbItem.talents = [{ id: testData.INDIVIDUAL_TALENT_ID, roles: ["Actor"] }];
    entity.get = jest.fn().mockResolvedValue(dbItem);

    populate.getReferencedEntities = jest.fn().mockResolvedValue({
      venue: [testData.createMinimalDbVenue()],
      talent: [testData.createMinimalIndividualDbTalent()],
      eventSeries: [testData.createMinimalDbEventSeries()]
    });

    const response = await eventService.getEvent(
      "almeida-theatre/2016/taming-of-the-shrew",
      true
    );

    expect(response).toEqual({
      entityType: "event",
      isFullEntity: true,
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
      description: "Poetry for people who dont like poetry.",
      venueId: testData.EVENT_VENUE_ID,
      venueName: "Almeida Theatre",
      postcode: "N1 1TA",
      latitude: 51.539464,
      longitude: -0.103103,
      venue: {
        entityType: "venue",
        id: testData.MINIMAL_VENUE_ID,
        name: "Almeida Theatre",
        status: "Active",
        venueType: "Theatre",
        address: "Almeida St\nIslington",
        postcode: "N1 1TA",
        latitude: 51.539464,
        longitude: -0.103103,
        wheelchairAccessType: "FullAccess",
        disabledBathroomType: "Present",
        hearingFacilitiesType: "HearingLoops",
        hasPermanentCollection: false
      },
      eventSeries: {
        entityType: "event-series",
        id: testData.EVENT_SERIES_ID,
        name: "Bang Said The Gun",
        status: "Active",
        eventSeriesType: "Occasional",
        occurrence: "Third Thursday of each month",
        summary: "A poetry riot",
        description: "Poetry for people who dont like poetry."
      },
      talents: [
        {
          entityType: "talent",
          id: testData.INDIVIDUAL_TALENT_ID,
          firstNames: "Carrie",
          lastName: "Cracknell",
          status: "Active",
          talentType: "Individual",
          commonRole: "Actor",
          roles: ["Actor"]
        }
      ]
    });

    expect(entity.get).toHaveBeenCalledWith(
      process.env.SERVERLESS_EVENT_TABLE_NAME,
      "almeida-theatre/2016/taming-of-the-shrew",
      false
    );

    expect(populate.getReferencedEntities).toHaveBeenCalledWith(dbItem);
  });
});
