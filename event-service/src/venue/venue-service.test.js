"use strict";

const testData = require("../test-data");
const venueService = require("./venue-service");
const venueConstants = require("./constants");
const entity = require("../entity/entity");
const elasticsearch = require("../external-services/elasticsearch");
const dynamodb = require("../external-services/dynamodb");
const eventMessaging = require("../event/messaging");
const etag = require("../lambda/etag");
const globalConstants = require("../constants");
const date = require("../date");

process.env.SERVERLESS_VENUE_TABLE_NAME = "venue-table";

const sync = fn =>
  fn.then(res => () => res).catch(err => () => {
    throw err;
  });

describe("createOrUpdateVenue", () => {
  beforeEach(() => {
    date.getTodayAsStringDate = jest.fn().mockReturnValue("2016/01/11");
  });

  it("should throw when request is invalid", async () => {
    expect(
      await sync(venueService.createOrUpdateVenue(null, { status: "Foo" }))
    ).toThrow();
  });

  it("should process create venue request", async () => {
    entity.write = jest.fn().mockResolvedValue();
    eventMessaging.notifyEventsForVenue = jest.fn();
    elasticsearch.bulk = jest.fn().mockResolvedValue();
    etag.writeETagToRedis = jest.fn().mockResolvedValue();

    const response = await venueService.createOrUpdateVenue(null, {
      name: "Almeida Theatre",
      status: "Active",
      venueType: "Theatre",
      address: "Almeida St\nIslington",
      postcode: "N1 1TA",
      latitude: 51.539464,
      longitude: -0.103103,
      description: "A description",
      wheelchairAccessType: "FullAccess",
      disabledBathroomType: "Present",
      hearingFacilitiesType: "HearingLoops",
      version: 1,
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11",
      hasPermanentCollection: true
    });

    expect(response).toEqual({
      id: testData.MINIMAL_VENUE_ID,
      name: "Almeida Theatre",
      status: "Active",
      venueType: "Theatre",
      description: "A description",
      address: "Almeida St\nIslington",
      postcode: "N1 1TA",
      latitude: 51.539464,
      longitude: -0.103103,
      wheelchairAccessType: "FullAccess",
      disabledBathroomType: "Present",
      hearingFacilitiesType: "HearingLoops",
      version: 1,
      schemeVersion: venueConstants.CURRENT_VENUE_SCHEME_VERSION,
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11",
      hasPermanentCollection: true
    });

    expect(entity.write).toHaveBeenCalledWith(
      process.env.SERVERLESS_VENUE_TABLE_NAME,
      {
        id: testData.MINIMAL_VENUE_ID,
        name: "Almeida Theatre",
        status: "Active",
        venueType: "Theatre",
        address: "Almeida St\nIslington",
        postcode: "N1 1TA",
        latitude: 51.539464,
        longitude: -0.103103,
        description: "A description",
        wheelchairAccessType: "FullAccess",
        disabledBathroomType: "Present",
        hearingFacilitiesType: "HearingLoops",
        version: 1,
        schemeVersion: venueConstants.CURRENT_VENUE_SCHEME_VERSION,
        createdDate: "2016/01/10",
        updatedDate: "2016/01/11",
        hasPermanentCollection: true
      }
    );

    expect(eventMessaging.notifyEventsForVenue).not.toHaveBeenCalled();

    expect(elasticsearch.bulk).toHaveBeenCalledWith({
      body: [
        {
          index: {
            _index: globalConstants.SEARCH_INDEX_TYPE_VENUE_FULL,
            _type: "doc",
            _id: testData.MINIMAL_VENUE_ID,
            _version: 1,
            _version_type: "external"
          }
        },
        {
          entityType: "venue",
          id: testData.MINIMAL_VENUE_ID,
          name: "Almeida Theatre",
          name_sort: "almeida theatre",
          status: "Active",
          venueType: "Theatre",
          address: "Almeida St\nIslington",
          postcode: "N1 1TA",
          latitude: 51.539464,
          longitude: -0.103103,
          locationOptimized: { lat: 51.539464, lon: -0.103103 },
          version: 1
        },
        {
          index: {
            _index: globalConstants.SEARCH_INDEX_TYPE_VENUE_AUTO,
            _type: "doc",
            _id: testData.MINIMAL_VENUE_ID,
            _version: 1,
            _version_type: "external"
          }
        },
        {
          nameSuggest: ["almeida theatre"],
          output: "Almeida Theatre",
          id: testData.MINIMAL_VENUE_ID,
          status: "Active",
          venueType: "Theatre",
          address: "Almeida St\nIslington",
          postcode: "N1 1TA",
          entityType: "venue",
          version: 1
        }
      ]
    });

    expect(etag.writeETagToRedis).toHaveBeenCalled();
  });

  it("should process update venue request", async () => {
    entity.write = jest.fn().mockResolvedValue();
    eventMessaging.notifyEventsForVenue = jest.fn().mockResolvedValue();
    elasticsearch.bulk = jest.fn().mockResolvedValue();
    etag.writeETagToRedis = jest.fn().mockResolvedValue();

    const response = await venueService.createOrUpdateVenue(
      testData.MINIMAL_VENUE_ID,
      {
        name: "Almeida Theatre",
        status: "Active",
        venueType: "Theatre",
        address: "Almeida St\nIslington",
        postcode: "N1 1TA",
        latitude: 51.539464,
        longitude: -0.103103,
        description: "A description",
        wheelchairAccessType: "FullAccess",
        disabledBathroomType: "Present",
        hearingFacilitiesType: "HearingLoops",
        version: 2,
        createdDate: "2016/01/10",
        updatedDate: "2016/01/11",
        hasPermanentCollection: false
      }
    );

    expect(response).toEqual({
      id: testData.MINIMAL_VENUE_ID,
      name: "Almeida Theatre",
      status: "Active",
      venueType: "Theatre",
      description: "A description",
      address: "Almeida St\nIslington",
      postcode: "N1 1TA",
      latitude: 51.539464,
      longitude: -0.103103,
      wheelchairAccessType: "FullAccess",
      disabledBathroomType: "Present",
      hearingFacilitiesType: "HearingLoops",
      version: 2,
      schemeVersion: venueConstants.CURRENT_VENUE_SCHEME_VERSION,
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11",
      hasPermanentCollection: false
    });

    expect(entity.write).toHaveBeenCalledWith(
      process.env.SERVERLESS_VENUE_TABLE_NAME,
      {
        id: testData.MINIMAL_VENUE_ID,
        name: "Almeida Theatre",
        status: "Active",
        venueType: "Theatre",
        address: "Almeida St\nIslington",
        postcode: "N1 1TA",
        latitude: 51.539464,
        longitude: -0.103103,
        description: "A description",
        wheelchairAccessType: "FullAccess",
        disabledBathroomType: "Present",
        hearingFacilitiesType: "HearingLoops",
        version: 2,
        schemeVersion: venueConstants.CURRENT_VENUE_SCHEME_VERSION,
        createdDate: "2016/01/10",
        updatedDate: "2016/01/11",
        hasPermanentCollection: false
      }
    );

    expect(eventMessaging.notifyEventsForVenue).toHaveBeenCalledWith(
      testData.MINIMAL_VENUE_ID
    );

    expect(elasticsearch.bulk).toHaveBeenCalledWith({
      body: [
        {
          index: {
            _index: globalConstants.SEARCH_INDEX_TYPE_VENUE_FULL,
            _type: "doc",
            _id: testData.MINIMAL_VENUE_ID,
            _version: 2,
            _version_type: "external"
          }
        },
        {
          entityType: "venue",
          id: testData.MINIMAL_VENUE_ID,
          name: "Almeida Theatre",
          name_sort: "almeida theatre",
          status: "Active",
          venueType: "Theatre",
          address: "Almeida St\nIslington",
          postcode: "N1 1TA",
          latitude: 51.539464,
          longitude: -0.103103,
          locationOptimized: { lat: 51.539464, lon: -0.103103 },
          version: 2
        },
        {
          index: {
            _index: globalConstants.SEARCH_INDEX_TYPE_VENUE_AUTO,
            _type: "doc",
            _id: testData.MINIMAL_VENUE_ID,
            _version: 2,
            _version_type: "external"
          }
        },
        {
          nameSuggest: ["almeida theatre"],
          output: "Almeida Theatre",
          id: testData.MINIMAL_VENUE_ID,
          status: "Active",
          venueType: "Theatre",
          address: "Almeida St\nIslington",
          postcode: "N1 1TA",
          entityType: "venue",
          version: 2
        }
      ]
    });

    expect(etag.writeETagToRedis).toHaveBeenCalled();
  });
});

describe("getVenueForEdit", () => {
  it("should process get request", async () => {
    const dbItem = testData.createMinimalDbVenue();
    entity.get = jest.fn().mockResolvedValue(dbItem);

    const response = await venueService.getVenueForEdit(
      testData.MINIMAL_VENUE_ID
    );

    expect(response).toEqual({
      id: testData.MINIMAL_VENUE_ID,
      status: "Active",
      name: "Almeida Theatre",
      venueType: "Theatre",
      address: "Almeida St\nIslington",
      postcode: "N1 1TA",
      latitude: 51.539464,
      longitude: -0.103103,
      wheelchairAccessType: "FullAccess",
      disabledBathroomType: "Present",
      hearingFacilitiesType: "HearingLoops",
      hasPermanentCollection: false,
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11",
      schemeVersion: venueConstants.CURRENT_VENUE_SCHEME_VERSION,
      version: 1
    });

    expect(entity.get).toHaveBeenCalledWith(
      process.env.SERVERLESS_VENUE_TABLE_NAME,
      testData.MINIMAL_VENUE_ID,
      true
    );
  });
});

describe("getVenueMulti", () => {
  it("should process a request", async () => {
    dynamodb.batchGet = jest.fn().mockResolvedValue({
      Responses: {
        [process.env.SERVERLESS_VENUE_TABLE_NAME]: [
          {
            id: "almeida-theatre"
          },
          {
            id: "tate-modern"
          }
        ]
      }
    });

    const response = await venueService.getVenueMulti([
      "almeida-theatre",
      "tate-modern"
    ]);

    expect(response).toEqual(
      expect.arrayContaining([
        {
          entityType: "venue",
          id: "almeida-theatre"
        },
        {
          entityType: "venue",
          id: "tate-modern"
        }
      ])
    );

    expect(dynamodb.batchGet).toHaveBeenCalled();
  });
});

describe("getVenue", () => {
  it("should process a get venue request", async () => {
    const dbItem = testData.createMinimalDbVenue();
    entity.get = jest.fn().mockResolvedValue(dbItem);

    const response = await venueService.getVenue(
      testData.MINIMAL_VENUE_ID,
      true
    );

    expect(response).toEqual({
      entityType: "venue",
      isFullEntity: true,
      id: testData.MINIMAL_VENUE_ID,
      status: "Active",
      name: "Almeida Theatre",
      venueType: "Theatre",
      address: "Almeida St\nIslington",
      postcode: "N1 1TA",
      latitude: 51.539464,
      longitude: -0.103103,
      wheelchairAccessType: "FullAccess",
      disabledBathroomType: "Present",
      hearingFacilitiesType: "HearingLoops",
      hasPermanentCollection: false
    });

    expect(entity.get).toHaveBeenCalledWith(
      process.env.SERVERLESS_VENUE_TABLE_NAME,
      testData.MINIMAL_VENUE_ID,
      false
    );
  });
});
