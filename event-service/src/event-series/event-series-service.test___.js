"use strict";

const testData = require("../test-data");
const entity = require("../entity/entity");
const eventSeriesService = require("./event-series-service");
const eventSeriesConstants = require("./constants");
const dynamodb = require("../external-services/dynamodb");
const messaging = require("../event/messaging");
const etag = require("../lambda/etag");
const date = require("../date");

process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME = "event-series-table";
process.env.SERVERLESS_EVENT_TABLE_NAME = "event-table";
process.env.SERVERLESS_EVENT_BY_EVENT_SERIES_INDEX_NAME =
  "event-by-event-series";

const sync = fn =>
  fn.then(res => () => res).catch(err => () => {
    throw err;
  });

describe("createOrUpdateEventSeries", () => {
  beforeEach(() => {
    date.getTodayAsStringDate = jest.fn().mockReturnValue("2016/01/11");
  });

  it("should throw an exception when request is invalid", async () => {
    expect(
      await sync(
        eventSeriesService.createOrUpdateEventSeries(null, {
          status: "Foo"
        })
      )
    ).toThrow();
  });

  it("should process create event series request", async () => {
    entity.write = jest.fn().mockResolvedValue();
    messaging.notifyEventsForEventSeries = jest.fn();
    etag.writeETagToRedis = jest.fn().mockResolvedValue();

    const response = await eventSeriesService.createOrUpdateEventSeries(null, {
      name: "Bang Said The Gun",
      status: "Active",
      eventSeriesType: "Occasional",
      occurrence: "Third Thursday of each month",
      summary: "A poetry riot",
      description: "Poetry for people who dont like poetry.",
      version: 1,
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11"
    });

    expect(response).toEqual({
      id: testData.EVENT_SERIES_ID,
      name: "Bang Said The Gun",
      status: "Active",
      eventSeriesType: "Occasional",
      occurrence: "Third Thursday of each month",
      summary: "A poetry riot",
      description: "Poetry for people who dont like poetry.",
      version: 1,
      schemeVersion: eventSeriesConstants.CURRENT_EVENT_SERIES_SCHEME_VERSION,
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11"
    });

    expect(entity.write).toHaveBeenCalledWith(
      process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME,
      {
        id: testData.EVENT_SERIES_ID,
        name: "Bang Said The Gun",
        status: "Active",
        eventSeriesType: "Occasional",
        occurrence: "Third Thursday of each month",
        summary: "A poetry riot",
        description: "Poetry for people who dont like poetry.",
        version: 1,
        schemeVersion: eventSeriesConstants.CURRENT_EVENT_SERIES_SCHEME_VERSION,
        createdDate: "2016/01/10",
        updatedDate: "2016/01/11"
      }
    );

    expect(messaging.notifyEventsForEventSeries).not.toHaveBeenCalled();
    expect(etag.writeETagToRedis).toHaveBeenCalled();
  });

  it("should process update event series request", async () => {
    entity.write = jest.fn().mockResolvedValue();
    messaging.notifyEventsForEventSeries = jest.fn().mockResolvedValue();
    etag.writeETagToRedis = jest.fn().mockResolvedValue();

    const response = await eventSeriesService.createOrUpdateEventSeries(
      testData.EVENT_SERIES_ID,
      {
        name: "Bang Said The Gun",
        status: "Active",
        eventSeriesType: "Occasional",
        occurrence: "Third Thursday of each month",
        summary: "A poetry riot",
        description: "Poetry for people who dont like poetry.",
        version: 5,
        createdDate: "2016/01/10",
        updatedDate: "2016/01/11"
      }
    );

    expect(response).toEqual({
      id: testData.EVENT_SERIES_ID,
      name: "Bang Said The Gun",
      status: "Active",
      eventSeriesType: "Occasional",
      occurrence: "Third Thursday of each month",
      summary: "A poetry riot",
      description: "Poetry for people who dont like poetry.",
      version: 5,
      schemeVersion: eventSeriesConstants.CURRENT_EVENT_SERIES_SCHEME_VERSION,
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11"
    });

    expect(entity.write).toHaveBeenCalledWith(
      process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME,
      {
        id: testData.EVENT_SERIES_ID,
        name: "Bang Said The Gun",
        status: "Active",
        eventSeriesType: "Occasional",
        occurrence: "Third Thursday of each month",
        summary: "A poetry riot",
        description: "Poetry for people who dont like poetry.",
        version: 5,
        schemeVersion: eventSeriesConstants.CURRENT_EVENT_SERIES_SCHEME_VERSION,
        createdDate: "2016/01/10",
        updatedDate: "2016/01/11"
      }
    );

    expect(messaging.notifyEventsForEventSeries).toHaveBeenCalledWith(
      testData.EVENT_SERIES_ID
    );
    expect(etag.writeETagToRedis).toHaveBeenCalled();
  });
});

describe("getEventSeriesForEdit", () => {
  it("should process a request", async () => {
    const dbItem = testData.createMinimalDbEventSeries();
    entity.get = jest.fn().mockResolvedValue(dbItem);

    const response = await eventSeriesService.getEventSeriesForEdit(
      "bang-said-the-gun"
    );

    expect(response).toEqual({
      id: testData.EVENT_SERIES_ID,
      name: "Bang Said The Gun",
      status: "Active",
      eventSeriesType: "Occasional",
      occurrence: "Third Thursday of each month",
      summary: "A poetry riot",
      description: "Poetry for people who dont like poetry.",
      createdDate: "2016/01/10",
      updatedDate: "2016/01/11",
      schemeVersion: eventSeriesConstants.CURRENT_EVENT_SERIES_SCHEME_VERSION,
      version: 1
    });

    expect(entity.get).toHaveBeenCalledWith(
      process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME,
      testData.EVENT_SERIES_ID,
      true
    );
  });
});

describe("getEventSeriesMulti", () => {
  it("should process a request", async () => {
    dynamodb.batchGet = jest.fn().mockResolvedValue({
      Responses: {
        [process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME]: [
          {
            id: "tate-modern-art"
          },
          {
            id: "bang-said-the-gun"
          }
        ]
      }
    });

    const response = await eventSeriesService.getEventSeriesMulti([
      "tate-modern-art",
      "bang-said-the-gun"
    ]);

    expect(response).toEqual(
      expect.arrayContaining([
        {
          entityType: "event-series",
          id: "tate-modern-art"
        },
        {
          entityType: "event-series",
          id: "bang-said-the-gun"
        }
      ])
    );

    expect(dynamodb.batchGet).toHaveBeenCalled();
  });
});

describe("getEventSeries", () => {
  it("should process a get request", async () => {
    const dbItem = testData.createMinimalDbEventSeries();
    entity.get = jest.fn().mockResolvedValue(dbItem);

    const response = await eventSeriesService.getEventSeries(
      testData.EVENT_SERIES_ID,
      true
    );

    expect(response).toEqual({
      entityType: "event-series",
      isFullEntity: true,
      id: testData.EVENT_SERIES_ID,
      name: "Bang Said The Gun",
      status: "Active",
      eventSeriesType: "Occasional",
      occurrence: "Third Thursday of each month",
      summary: "A poetry riot",
      description: "Poetry for people who dont like poetry."
    });

    expect(entity.get).toHaveBeenCalledWith(
      process.env.SERVERLESS_EVENT_SERIES_TABLE_NAME,
      testData.EVENT_SERIES_ID,
      false
    );
  });
});
