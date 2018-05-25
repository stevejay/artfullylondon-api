"use strict";

const request = require("request-promise-native");
const uuidv4 = require("uuid/v4");
const testUtils = require("./utils");
jest.setTimeout(15000);

const VALID_NEW_EVENT_SERIES = {
  eventSeriesType: "Occasional",
  occurrence: "Third Thursday of each month",
  name: uuidv4(),
  images: [
    {
      id: "89bbe5df833341c88976f2572c0a1557",
      ratio: 1,
      copyright: "Bang Said The Gun"
    }
  ],
  summary: "Stand-up poetry",
  description:
    "<p>Poetry for people who don't like poetry! This event is held on the third Thursday of each month. Each night consists of performances by a number of poets followed by an open mic spot.</p>",
  status: "Active",
  version: 1
};

describe("talent", () => {
  let testEventSeriesId = null;

  beforeAll(async () => {
    await testUtils.createElasticsearchIndex("event-series-full");
    await testUtils.createElasticsearchIndex("event-series-auto");
    await testUtils.createElasticsearchIndex("combined-event-auto");
  });

  afterAll(async () => {
    await testUtils.deleteElasticsearchIndex("event-series-full");
    await testUtils.deleteElasticsearchIndex("event-series-auto");
    await testUtils.deleteElasticsearchIndex("combined-event-auto");
  });

  it("should fail to create an invalid event series", async () => {
    expect(
      await testUtils.sync(
        request({
          uri: "http://localhost:3030/admin/event-series",
          json: true,
          method: "POST",
          headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
          body: { status: "Active" },
          timeout: 14000
        })
      )
    ).toThrow(/Name can't be blank/);
  });

  it("should fail to create an event series when the user is the readonly user", async () => {
    expect(
      await testUtils.sync(
        request({
          uri: "http://localhost:3030/admin/event-series",
          json: true,
          method: "POST",
          headers: { Authorization: testUtils.READONLY_AUTH_TOKEN },
          body: VALID_NEW_EVENT_SERIES,
          timeout: 14000
        })
      )
    ).toThrow(/readonly user cannot modify system/);
  });

  it("should create a valid event series", async () => {
    const response = await request({
      uri: "http://localhost:3030/admin/event-series",
      json: true,
      method: "POST",
      headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
      body: VALID_NEW_EVENT_SERIES,
      timeout: 14000
    });

    expect(response.entity).toEqual(
      expect.objectContaining({
        eventSeriesType: "Occasional",
        summary: "Stand-up poetry",
        status: "Active",
        version: 1
      })
    );

    testEventSeriesId = response.entity.id;
  });

  it("should put the created event series in elasticsearch", async () => {
    let response = await testUtils.getDocument(
      "event-series-full",
      testEventSeriesId
    );

    expect(response).toEqual(
      expect.objectContaining({
        _id: testEventSeriesId,
        _index: "event-series-full",
        _type: "doc",
        _version: 1,
        found: true
      })
    );

    response = await testUtils.getDocument(
      "event-series-auto",
      testEventSeriesId
    );

    expect(response).toEqual(
      expect.objectContaining({
        _id: testEventSeriesId,
        _index: "event-series-auto",
        _type: "doc",
        _version: 1,
        found: true
      })
    );

    response = await testUtils.getDocument(
      "combined-event-auto",
      testEventSeriesId
    );

    expect(response).toEqual(
      expect.objectContaining({
        _id: testEventSeriesId,
        _index: "combined-event-auto",
        _type: "doc",
        _version: 1,
        found: true
      })
    );
  });

  it("should get the event series with cache control headers when using the public api", async () => {
    const response = await request({
      uri: "http://localhost:3030/public/event-series/" + testEventSeriesId,
      json: true,
      method: "GET",
      timeout: 14000,
      resolveWithFullResponse: true
    });

    expect(response.headers).toEqual(
      expect.objectContaining({
        "x-artfully-cache": "Miss",
        "cache-control": "public, max-age=1800"
      })
    );

    expect(response.headers.etag).toBeDefined();

    expect(response.body.entity).toEqual(
      expect.objectContaining({
        id: testEventSeriesId,
        eventSeriesType: "Occasional",
        summary: "Stand-up poetry",
        entityType: "event-series",
        status: "Active",
        isFullEntity: true
      })
    );
  });

  it("should get the event series without cache control headers when using the admin api", async () => {
    const response = await request({
      uri: "http://localhost:3030/admin/event-series/" + testEventSeriesId,
      json: true,
      method: "GET",
      timeout: 14000,
      resolveWithFullResponse: true
    });

    expect(response.headers).toEqual(
      expect.objectContaining({
        "cache-control": "no-cache"
      })
    );

    expect(response.headers.etag).not.toBeDefined();

    expect(response.body.entity).toEqual(
      expect.objectContaining({
        id: testEventSeriesId,
        eventSeriesType: "Occasional",
        summary: "Stand-up poetry",
        status: "Active",
        version: 1
      })
    );
  });

  it("should get the event series using the get multi endpoint", async () => {
    const response = await request({
      uri:
        "http://localhost:3030/public/event-series?ids=" +
        encodeURIComponent(testEventSeriesId),
      json: true,
      method: "GET",
      timeout: 14000
    });

    expect(response.entities.length).toEqual(1);

    expect(response.entities[0]).toEqual(
      expect.objectContaining({
        id: testEventSeriesId,
        eventSeriesType: "Occasional",
        summary: "Stand-up poetry",
        entityType: "event-series",
        status: "Active"
      })
    );
  });

  it("should reject a stale update to the event series", async () => {
    expect(
      await testUtils.sync(
        request({
          uri: "http://localhost:3030/admin/event-series/" + testEventSeriesId,
          json: true,
          method: "PUT",
          headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
          body: VALID_NEW_EVENT_SERIES,
          timeout: 14000
        })
      )
    ).toThrow(/Stale Data/);
  });

  it("should accept a valid update to the event series", async () => {
    const response = await request({
      uri: "http://localhost:3030/admin/event-series/" + testEventSeriesId,
      json: true,
      method: "PUT",
      headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
      body: {
        ...VALID_NEW_EVENT_SERIES,
        summary: "Stand-up poetry New",
        version: 2
      },
      timeout: 14000
    });

    expect(response.entity).toEqual(
      expect.objectContaining({
        id: testEventSeriesId,
        summary: "Stand-up poetry New",
        status: "Active",
        version: 2
      })
    );
  });

  it("should put the updated event series in elasticsearch", async () => {
    let response = await testUtils.getDocument(
      "event-series-full",
      testEventSeriesId
    );

    expect(response).toEqual(
      expect.objectContaining({
        _id: testEventSeriesId,
        _index: "event-series-full",
        _type: "doc",
        _version: 2,
        found: true
      })
    );

    response = await testUtils.getDocument(
      "event-series-auto",
      testEventSeriesId
    );

    expect(response).toEqual(
      expect.objectContaining({
        _id: testEventSeriesId,
        _index: "event-series-auto",
        _type: "doc",
        _version: 2,
        found: true
      })
    );

    response = await testUtils.getDocument(
      "combined-event-auto",
      testEventSeriesId
    );

    expect(response).toEqual(
      expect.objectContaining({
        _id: testEventSeriesId,
        _index: "combined-event-auto",
        _type: "doc",
        _version: 2,
        found: true
      })
    );
  });

  it("should fail to get a non-existent event series", async () => {
    expect(
      await testUtils.sync(
        request({
          uri: "http://localhost:3030/public/event-series/does-not-exist",
          json: true,
          method: "GET",
          timeout: 14000,
          resolveWithFullResponse: true
        })
      )
    ).toThrow(/Entity Not Found/);
  });
});
