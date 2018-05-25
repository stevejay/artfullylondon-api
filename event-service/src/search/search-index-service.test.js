"use strict";

const moment = require("moment");
const dynamodb = require("../external-services/dynamodb");
const elasticsearch = require("../external-services/elasticsearch");
const sns = require("../external-services/sns");
const testData = require("../test-data");
const globalConstants = require("../constants");
const searchIndexService = require("./search-index-service");
const etag = require("../lambda/etag");

process.env.SERVERLESS_REFRESH_SEARCH_INDEX_TOPIC_ARN = "refresh-search-index";
process.env.SERVERLESS_TALENT_TABLE_NAME = "talent-table";
process.env.SERVERLESS_VENUE_TABLE_NAME = "venue-table";
process.env.SERVERLESS_EVENT_TABLE_NAME = "event-table";
process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME = "event-series-table";

const sync = fn =>
  fn.then(res => () => res).catch(err => () => {
    throw err;
  });

describe("processRefreshSearchIndexMessage", () => {
  it("should refresh talents in the talent full index when multiple scans are required", async () => {
    dynamodb.scanBasic = jest.fn().mockResolvedValue({
      Items: [testData.createMinimalIndividualDbTalent()],
      LastEvaluatedKey: "some-talent"
    });

    elasticsearch.bulk = jest.fn().mockResolvedValue();
    dynamodb.batchGet = jest.fn();
    sns.notify = jest.fn().mockResolvedValue();

    await searchIndexService.processRefreshSearchIndexMessage({
      index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL,
      version: 10,
      entity: "talent",
      exclusiveStartKey: null
    });

    expect(dynamodb.scanBasic).toHaveBeenCalledWith({
      TableName: process.env.SERVERLESS_TALENT_TABLE_NAME,
      ExclusiveStartKey: null,
      Limit: globalConstants.REFRESH_SEARCH_INDEX_MAX_TAKE_PER_SCAN,
      ConsistentRead: false
    });

    expect(elasticsearch.bulk).toHaveBeenCalledWith({
      body: [
        {
          index: {
            _index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL + "_v10",
            _type: "doc",
            _id: testData.INDIVIDUAL_TALENT_ID,
            _version: 3,
            _version_type: "external"
          }
        },
        {
          entityType: "talent",
          id: testData.INDIVIDUAL_TALENT_ID,
          firstNames: "Carrie",
          lastName: "Cracknell",
          lastName_sort: "cracknell",
          status: "Active",
          talentType: "Individual",
          commonRole: "Actor",
          version: 3
        }
      ]
    });

    expect(dynamodb.batchGet).not.toHaveBeenCalled();

    expect(sns.notify).toHaveBeenCalledWith(
      {
        index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL,
        version: 10,
        entity: "talent",
        exclusiveStartKey: "some-talent"
      },
      { arn: "refresh-search-index" }
    );
  });

  it("should refresh talents in the talent full index when no index version is specified", async () => {
    dynamodb.scanBasic = jest.fn().mockResolvedValue({
      Items: [testData.createMinimalIndividualDbTalent()]
    });

    elasticsearch.bulk = jest.fn().mockResolvedValue();
    dynamodb.batchGet = jest.fn();
    sns.notify = jest.fn();

    await searchIndexService.processRefreshSearchIndexMessage({
      index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL,
      version: undefined,
      entity: "talent",
      exclusiveStartKey: null
    });

    expect(elasticsearch.bulk).toHaveBeenCalledWith({
      body: [
        {
          index: {
            _index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL,
            _type: "doc",
            _id: testData.INDIVIDUAL_TALENT_ID,
            _version: 3,
            _version_type: "external"
          }
        },
        {
          entityType: "talent",
          id: testData.INDIVIDUAL_TALENT_ID,
          firstNames: "Carrie",
          lastName: "Cracknell",
          lastName_sort: "cracknell",
          status: "Active",
          talentType: "Individual",
          commonRole: "Actor",
          version: 3
        }
      ]
    });

    expect(dynamodb.scanBasic).toHaveBeenCalledWith({
      TableName: process.env.SERVERLESS_TALENT_TABLE_NAME,
      ExclusiveStartKey: null,
      Limit: globalConstants.REFRESH_SEARCH_INDEX_MAX_TAKE_PER_SCAN,
      ConsistentRead: false
    });

    expect(dynamodb.batchGet).not.toHaveBeenCalled();
    expect(sns.notify).not.toHaveBeenCalled();
  });

  it("should refresh talents in the talent full index", async () => {
    dynamodb.scanBasic = jest.fn().mockResolvedValue({
      Items: [testData.createMinimalIndividualDbTalent()]
    });

    elasticsearch.bulk = jest.fn().mockResolvedValue();
    dynamodb.batchGet = jest.fn();
    sns.notify = jest.fn();

    await searchIndexService.processRefreshSearchIndexMessage({
      index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL,
      version: 10,
      entity: "talent",
      exclusiveStartKey: null
    });

    expect(dynamodb.scanBasic).toHaveBeenCalledWith({
      TableName: process.env.SERVERLESS_TALENT_TABLE_NAME,
      ExclusiveStartKey: null,
      Limit: globalConstants.REFRESH_SEARCH_INDEX_MAX_TAKE_PER_SCAN,
      ConsistentRead: false
    });

    expect(elasticsearch.bulk).toHaveBeenCalledWith({
      body: [
        {
          index: {
            _index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL + "_v10",
            _type: "doc",
            _id: testData.INDIVIDUAL_TALENT_ID,
            _version: 3,
            _version_type: "external"
          }
        },
        {
          entityType: "talent",
          id: testData.INDIVIDUAL_TALENT_ID,
          firstNames: "Carrie",
          lastName: "Cracknell",
          lastName_sort: "cracknell",
          status: "Active",
          talentType: "Individual",
          commonRole: "Actor",
          version: 3
        }
      ]
    });

    expect(dynamodb.batchGet).not.toHaveBeenCalled();
    expect(sns.notify).not.toHaveBeenCalled();
  });

  it("should refresh talents in the talent auto index", async () => {
    dynamodb.scanBasic = jest.fn().mockResolvedValue({
      Items: [testData.createMinimalIndividualDbTalent()]
    });

    elasticsearch.bulk = jest.fn().mockResolvedValue();
    dynamodb.batchGet = jest.fn();
    sns.notify = jest.fn();

    await searchIndexService.processRefreshSearchIndexMessage({
      index: globalConstants.SEARCH_INDEX_TYPE_TALENT_AUTO,
      version: 10,
      entity: "talent",
      exclusiveStartKey: null
    });

    expect(dynamodb.scanBasic).toHaveBeenCalledWith({
      TableName: process.env.SERVERLESS_TALENT_TABLE_NAME,
      ExclusiveStartKey: null,
      Limit: globalConstants.REFRESH_SEARCH_INDEX_MAX_TAKE_PER_SCAN,
      ConsistentRead: false
    });

    expect(elasticsearch.bulk).toHaveBeenCalledWith({
      body: [
        {
          index: {
            _index: globalConstants.SEARCH_INDEX_TYPE_TALENT_AUTO + "_v10",
            _type: "doc",
            _id: testData.INDIVIDUAL_TALENT_ID,
            _version: 3,
            _version_type: "external"
          }
        },
        {
          nameSuggest: ["carrie cracknell", "cracknell"],
          output: "Carrie Cracknell",
          id: testData.INDIVIDUAL_TALENT_ID,
          status: "Active",
          talentType: "Individual",
          commonRole: "Actor",
          entityType: "talent",
          version: 3
        }
      ]
    });

    expect(dynamodb.batchGet).not.toHaveBeenCalled();
    expect(sns.notify).not.toHaveBeenCalled();
  });

  it("should refresh venues in the venue full index", async () => {
    dynamodb.scanBasic = jest.fn().mockResolvedValue({
      Items: [testData.createMinimalDbVenue()]
    });

    elasticsearch.bulk = jest.fn().mockResolvedValue();
    dynamodb.batchGet = jest.fn();
    sns.notify = jest.fn();

    await searchIndexService.processRefreshSearchIndexMessage({
      index: globalConstants.SEARCH_INDEX_TYPE_VENUE_FULL,
      version: 10,
      entity: "venue",
      exclusiveStartKey: null
    });

    expect(dynamodb.scanBasic).toHaveBeenCalledWith({
      TableName: process.env.SERVERLESS_VENUE_TABLE_NAME,
      ExclusiveStartKey: null,
      Limit: globalConstants.REFRESH_SEARCH_INDEX_MAX_TAKE_PER_SCAN,
      ConsistentRead: false
    });

    expect(elasticsearch.bulk).toHaveBeenCalledWith({
      body: [
        {
          index: {
            _index: globalConstants.SEARCH_INDEX_TYPE_VENUE_FULL + "_v10",
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
        }
      ]
    });

    expect(dynamodb.batchGet).not.toHaveBeenCalled();
    expect(sns.notify).not.toHaveBeenCalled();
  });

  it("should refresh venues in the venue auto index", async () => {
    dynamodb.scanBasic = jest.fn().mockResolvedValue({
      Items: [testData.createMinimalDbVenue()]
    });

    elasticsearch.bulk = jest.fn().mockResolvedValue();
    dynamodb.batchGet = jest.fn();
    sns.notify = jest.fn();

    await searchIndexService.processRefreshSearchIndexMessage({
      index: globalConstants.SEARCH_INDEX_TYPE_VENUE_AUTO,
      version: 10,
      entity: "venue",
      exclusiveStartKey: null
    });

    expect(dynamodb.scanBasic).toHaveBeenCalledWith({
      TableName: process.env.SERVERLESS_VENUE_TABLE_NAME,
      ExclusiveStartKey: null,
      Limit: globalConstants.REFRESH_SEARCH_INDEX_MAX_TAKE_PER_SCAN,
      ConsistentRead: false
    });

    expect(elasticsearch.bulk).toHaveBeenCalledWith({
      body: [
        {
          index: {
            _index: globalConstants.SEARCH_INDEX_TYPE_VENUE_AUTO + "_v10",
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

    expect(dynamodb.batchGet).not.toHaveBeenCalled();
    expect(sns.notify).not.toHaveBeenCalled();
  });

  it("should refresh event series in the event series full index", async () => {
    dynamodb.scanBasic = jest.fn().mockResolvedValue({
      Items: [testData.createMinimalDbEventSeries()]
    });

    elasticsearch.bulk = jest.fn().mockResolvedValue();
    dynamodb.batchGet = jest.fn();
    sns.notify = jest.fn();

    await searchIndexService.processRefreshSearchIndexMessage({
      index: globalConstants.SEARCH_INDEX_TYPE_EVENT_SERIES_FULL,
      version: 10,
      entity: "event-series",
      exclusiveStartKey: null
    });

    expect(dynamodb.scanBasic).toHaveBeenCalledWith({
      TableName: process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME,
      ExclusiveStartKey: null,
      Limit: globalConstants.REFRESH_SEARCH_INDEX_MAX_TAKE_PER_SCAN,
      ConsistentRead: false
    });

    expect(elasticsearch.bulk).toHaveBeenCalledWith({
      body: [
        {
          index: {
            _index:
              globalConstants.SEARCH_INDEX_TYPE_EVENT_SERIES_FULL + "_v10",
            _type: "doc",
            _id: testData.EVENT_SERIES_ID,
            _version: 1,
            _version_type: "external"
          }
        },
        {
          entityType: "event-series",
          id: testData.EVENT_SERIES_ID,
          name: "Bang Said The Gun",
          name_sort: "bang said the gun",
          status: "Active",
          eventSeriesType: "Occasional",
          summary: "A poetry riot",
          occurrence: "Third Thursday of each month",
          version: 1
        }
      ]
    });

    expect(dynamodb.batchGet).not.toHaveBeenCalled();
    expect(sns.notify).not.toHaveBeenCalled();
  });

  it("should refresh event series in the event series auto index", async () => {
    dynamodb.scanBasic = jest.fn().mockResolvedValue({
      Items: [testData.createMinimalDbEventSeries()]
    });

    elasticsearch.bulk = jest.fn().mockResolvedValue();
    dynamodb.batchGet = jest.fn();
    sns.notify = jest.fn();

    await searchIndexService.processRefreshSearchIndexMessage({
      index: globalConstants.SEARCH_INDEX_TYPE_EVENT_SERIES_AUTO,
      version: 10,
      entity: "event-series",
      exclusiveStartKey: null
    });

    expect(dynamodb.scanBasic).toHaveBeenCalledWith({
      TableName: process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME,
      ExclusiveStartKey: null,
      Limit: globalConstants.REFRESH_SEARCH_INDEX_MAX_TAKE_PER_SCAN,
      ConsistentRead: false
    });

    expect(elasticsearch.bulk).toHaveBeenCalledWith({
      body: [
        {
          index: {
            _index:
              globalConstants.SEARCH_INDEX_TYPE_EVENT_SERIES_AUTO + "_v10",
            _type: "doc",
            _id: testData.EVENT_SERIES_ID,
            _version: 1,
            _version_type: "external"
          }
        },
        {
          nameSuggest: ["bang said the gun"],
          output: "Bang Said The Gun (Event Series)",
          id: testData.EVENT_SERIES_ID,
          status: "Active",
          entityType: "event-series",
          version: 1
        }
      ]
    });

    expect(dynamodb.batchGet).not.toHaveBeenCalled();
    expect(sns.notify).not.toHaveBeenCalled();
  });

  it("should refresh events in the event full index", async () => {
    const dbEvent = testData.createMinimalPerformanceDbEvent();
    dbEvent.venueId = testData.MINIMAL_VENUE_ID;
    dynamodb.scanBasic = jest.fn().mockResolvedValue({ Items: [dbEvent] });

    dynamodb.batchGet = jest.fn().mockResolvedValue({
      Responses: {
        [process.env.SERVERLESS_VENUE_TABLE_NAME]: [
          testData.createMinimalDbVenue()
        ]
      }
    });

    elasticsearch.bulk = jest.fn().mockResolvedValue();
    sns.notify = jest.fn();

    await searchIndexService.processRefreshSearchIndexMessage({
      index: globalConstants.SEARCH_INDEX_TYPE_EVENT_FULL,
      version: 10,
      entity: "event",
      exclusiveStartKey: null
    });

    expect(dynamodb.scanBasic).toHaveBeenCalledWith({
      TableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
      ExclusiveStartKey: null,
      Limit: globalConstants.REFRESH_SEARCH_INDEX_MAX_TAKE_PER_SCAN,
      ConsistentRead: false
    });

    expect(elasticsearch.bulk).toHaveBeenCalledWith({
      body: [
        {
          index: {
            _index: globalConstants.SEARCH_INDEX_TYPE_EVENT_FULL + "_v10",
            _type: "doc",
            _id: testData.PERFORMANCE_EVENT_ID
          }
        },
        {
          entityType: "event",
          id: "almeida-theatre/2016/taming-of-the-shrew",
          status: "Active",
          name: "Taming of the Shrew",
          name_sort: "taming of the shrew",
          venueId: "almeida-theatre",
          venueName: "Almeida Theatre",
          venueName_sort: "almeida theatre",
          area: "Central",
          postcode: "N1 1TA",
          eventType: "Performance",
          occurrenceType: "Bounded",
          dateFrom: "2016/02/11",
          dateTo: "2016/02/13",
          costType: "Paid",
          bookingType: "NotRequired",
          artsType: "Performing",
          summary: "A Shakespearian classic",
          rating: 3,
          latitude: 51.539464,
          longitude: -0.103103,
          locationOptimized: { lat: 51.539464, lon: -0.103103 },
          version: 4
        }
      ]
    });

    expect(dynamodb.batchGet).toHaveBeenCalledWith({
      RequestItems: {
        [process.env.SERVERLESS_VENUE_TABLE_NAME]: {
          Keys: [{ id: testData.MINIMAL_VENUE_ID }],
          ConsistentRead: false
        }
      },
      ReturnConsumedCapacity: undefined
    });

    expect(sns.notify).not.toHaveBeenCalled();
  });
});

describe("refreshSearchIndex", () => {
  it("should throw an error when request is invalid", async () => {
    expect(
      await sync(
        searchIndexService.refreshSearchIndex({
          index: "Foo",
          version: "latest"
        })
      )
    ).toThrow();
  });

  it("should handle the refresh of an index when latest index version is specified", async () => {
    sns.notify = jest.fn().mockResolvedValue();

    await searchIndexService.refreshSearchIndex({
      index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL,
      version: "latest"
    });

    expect(sns.notify).toHaveBeenCalledWith(
      {
        index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL,
        version: null,
        entity: "talent",
        exclusiveStartKey: null
      },
      { arn: "refresh-search-index" }
    );
  });

  it("should handle the refresh of the talent full index", async () => {
    sns.notify = jest.fn().mockResolvedValue();

    await searchIndexService.refreshSearchIndex({
      index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL,
      version: 10
    });

    expect(sns.notify).toHaveBeenCalledWith(
      {
        index: globalConstants.SEARCH_INDEX_TYPE_TALENT_FULL,
        version: 10,
        entity: "talent",
        exclusiveStartKey: null
      },
      { arn: "refresh-search-index" }
    );
  });

  it("should handle the refresh of the talent auto index", async () => {
    sns.notify = jest.fn().mockResolvedValue();

    await searchIndexService.refreshSearchIndex({
      index: globalConstants.SEARCH_INDEX_TYPE_TALENT_AUTO,
      version: 10
    });

    expect(sns.notify).toHaveBeenCalledWith(
      {
        index: globalConstants.SEARCH_INDEX_TYPE_TALENT_AUTO,
        version: 10,
        entity: "talent",
        exclusiveStartKey: null
      },
      { arn: "refresh-search-index" }
    );
  });

  it("should handle the refresh of the combined event auto index", async () => {
    sns.notify = jest.fn().mockResolvedValue();

    await searchIndexService.refreshSearchIndex({
      index: globalConstants.SEARCH_INDEX_TYPE_COMBINED_EVENT_AUTO,
      version: 10
    });

    expect(sns.notify).toHaveBeenCalledTimes(2);

    expect(sns.notify).toHaveBeenCalledWith(
      {
        index: globalConstants.SEARCH_INDEX_TYPE_COMBINED_EVENT_AUTO,
        version: 10,
        entity: "event",
        exclusiveStartKey: null
      },
      { arn: "refresh-search-index" }
    );

    expect(sns.notify).toHaveBeenCalledWith(
      {
        index: globalConstants.SEARCH_INDEX_TYPE_COMBINED_EVENT_AUTO,
        version: 10,
        entity: "event-series",
        exclusiveStartKey: null
      },
      { arn: "refresh-search-index" }
    );
  });
});

describe("updateEventSearchIndex", () => {
  it("should update an event in the event search indexes", async () => {
    const futureDate = moment
      .utc()
      .startOf("day")
      .add(10, "days")
      .format(globalConstants.DATE_FORMAT);

    const dbItem = testData.createMinimalPerformanceDbEvent();
    dbItem.venueId = testData.MINIMAL_VENUE_ID;
    dbItem.occurrenceType = "Occasional";
    delete dbItem.dateFrom;
    delete dbItem.dateTo;

    dbItem.additionalPerformances = [
      { date: futureDate, at: "18:00" },
      { date: futureDate, at: "19:00" },
      { date: futureDate, at: "20:00" }
    ];

    dbItem.specialPerformances = [
      {
        date: futureDate,
        at: "18:00",
        audienceTags: [{ id: "audience/family", label: "family" }]
      },
      {
        date: futureDate,
        at: "19:00",
        audienceTags: [
          { id: "audience/teenagers", label: "teenagers" },
          { id: "audience/family", label: "family" }
        ]
      }
    ];

    dynamodb.get = jest.fn().mockResolvedValue(dbItem);

    dynamodb.batchGet = jest.fn().mockResolvedValue({
      Responses: {
        [process.env.SERVERLESS_VENUE_TABLE_NAME]: [
          testData.createMinimalDbVenue()
        ]
      }
    });

    elasticsearch.bulk = jest.fn().mockResolvedValue();
    etag.writeETagToRedis = jest.fn().mockResolvedValue();

    await searchIndexService.updateEventSearchIndex(
      testData.PERFORMANCE_EVENT_ID
    );

    expect(dynamodb.get).toHaveBeenCalledWith({
      TableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
      Key: { id: testData.PERFORMANCE_EVENT_ID },
      ConsistentRead: true,
      ReturnConsumedCapacity: undefined
    });

    expect(dynamodb.batchGet).toHaveBeenCalledWith({
      RequestItems: {
        [process.env.SERVERLESS_VENUE_TABLE_NAME]: {
          Keys: [{ id: testData.MINIMAL_VENUE_ID }],
          ConsistentRead: true
        }
      },
      ReturnConsumedCapacity: undefined
    });

    expect(elasticsearch.bulk).toHaveBeenCalledWith({
      body: [
        {
          index: {
            _index: globalConstants.SEARCH_INDEX_TYPE_EVENT_FULL,
            _type: "doc",
            _id: testData.PERFORMANCE_EVENT_ID
          }
        },
        {
          entityType: "event",
          id: "almeida-theatre/2016/taming-of-the-shrew",
          status: "Active",
          name: "Taming of the Shrew",
          name_sort: "taming of the shrew",
          venueId: "almeida-theatre",
          venueName: "Almeida Theatre",
          venueName_sort: "almeida theatre",
          area: "Central",
          postcode: "N1 1TA",
          eventType: "Performance",
          occurrenceType: "Occasional",
          costType: "Paid",
          bookingType: "NotRequired",
          artsType: "Performing",
          summary: "A Shakespearian classic",
          rating: 3,
          latitude: 51.539464,
          longitude: -0.103103,
          locationOptimized: { lat: 51.539464, lon: -0.103103 },
          dates: [
            {
              date: futureDate,
              from: "18:00",
              to: "18:00",
              tags: ["audience/family"]
            },
            {
              date: futureDate,
              from: "19:00",
              to: "19:00",
              tags: ["audience/teenagers", "audience/family"]
            },
            {
              date: futureDate,
              from: "20:00",
              to: "20:00"
            }
          ],
          version: 4
        },
        {
          index: {
            _index: globalConstants.SEARCH_INDEX_TYPE_COMBINED_EVENT_AUTO,
            _type: "doc",
            _id: testData.PERFORMANCE_EVENT_ID,
            _version: 4,
            _version_type: "external"
          }
        },
        {
          nameSuggest: ["taming of the shrew", "almeida theatre"],
          output: "Taming of the Shrew (Almeida Theatre)",
          id: "almeida-theatre/2016/taming-of-the-shrew",
          status: "Active",
          eventType: "Performance",
          entityType: "event",
          version: 4
        }
      ]
    });

    expect(etag.writeETagToRedis).toHaveBeenCalled();
  });
});
