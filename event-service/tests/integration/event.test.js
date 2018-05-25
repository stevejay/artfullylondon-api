"use strict";

const request = require("request-promise-native");
const uuidv4 = require("uuid/v4");
const delay = require("delay");
const testUtils = require("./utils");
jest.setTimeout(30000);

describe("event", () => {
  let testVenueId = null;
  let testTalentId = null;
  let testEventId = null;
  const testVenueBody = testUtils.createNewVenueBody();
  const testTalentBody = testUtils.createNewTalentBody();
  let testEventBody = null;

  beforeAll(async () => {
    await testUtils.createElasticsearchIndex("venue-full");
    await testUtils.createElasticsearchIndex("venue-auto");
    await testUtils.createElasticsearchIndex("talent-full");
    await testUtils.createElasticsearchIndex("talent-auto");
    await testUtils.createElasticsearchIndex("event-full");
    await testUtils.createElasticsearchIndex("combined-event-auto");
    await testUtils.truncateAllTables();

    let response = await request({
      uri: "http://localhost:3030/admin/venue",
      json: true,
      method: "POST",
      headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
      body: testVenueBody,
      timeout: 14000
    });

    testVenueId = response.entity.id;

    response = await request({
      uri: "http://localhost:3030/admin/talent",
      json: true,
      method: "POST",
      headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
      body: testTalentBody,
      timeout: 14000
    });

    testTalentId = response.entity.id;

    testEventBody = testUtils.createNewEventBody(
      testVenueId,
      testTalentId,
      null
    );
  });

  afterAll(async () => {
    await testUtils.deleteElasticsearchIndex("venue-full");
    await testUtils.deleteElasticsearchIndex("venue-auto");
    await testUtils.deleteElasticsearchIndex("talent-full");
    await testUtils.deleteElasticsearchIndex("talent-auto");
    await testUtils.deleteElasticsearchIndex("event-full");
    await testUtils.deleteElasticsearchIndex("combined-event-auto");
  });

  it("should fail to create an invalid event", async () => {
    expect(
      await testUtils.sync(
        request({
          uri: "http://localhost:3030/admin/event",
          json: true,
          method: "POST",
          headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
          body: { status: "Active" },
          timeout: 14000
        })
      )
    ).toThrow(/Name can't be blank/);
  });

  it("should fail to create an event when the user is the readonly user", async () => {
    expect(
      await testUtils.sync(
        request({
          uri: "http://localhost:3030/admin/event",
          json: true,
          method: "POST",
          headers: { Authorization: testUtils.READONLY_AUTH_TOKEN },
          body: testEventBody,
          timeout: 14000
        })
      )
    ).toThrow(/readonly user cannot modify system/);
  });

  it("should create a valid event", async () => {
    const response = await request({
      uri: "http://localhost:3030/admin/event",
      json: true,
      method: "POST",
      headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
      body: testEventBody,
      timeout: 14000
    });

    expect(response.entity).toEqual(
      expect.objectContaining({
        eventType: "Exhibition",
        occurrenceType: "Bounded",
        costType: "Free",
        status: "Active",
        version: 1
      })
    );

    testEventId = response.entity.id;

    console.log("TEST_EVENT_ID", testEventId);

    await delay(5000);
  });

  it("should get the event without cache control headers when using the admin api", async () => {
    const response = await request({
      uri: "http://localhost:3030/admin/event/" + testEventId,
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
        id: testEventId,
        eventType: "Exhibition",
        occurrenceType: "Bounded",
        costType: "Free",
        status: "Active",
        version: 1
      })
    );
  });

  it("should get the event with cache control headers when using the public api", async () => {
    const response = await request({
      uri: "http://localhost:3030/public/event/" + testEventId,
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
        id: testEventId,
        eventType: "Exhibition",
        occurrenceType: "Bounded",
        costType: "Free",
        entityType: "event",
        status: "Active",
        isFullEntity: true
      })
    );
  });

  it("should have put the created event in elasticsearch", async () => {
    let response = await testUtils.getDocument("event-full", testEventId);

    expect(response).toEqual(
      expect.objectContaining({
        _id: testEventId,
        _index: "event-full",
        _type: "doc",
        _version: 1,
        found: true
      })
    );

    response = await testUtils.getDocument("combined-event-auto", testEventId);

    expect(response).toEqual(
      expect.objectContaining({
        _id: testEventId,
        _index: "combined-event-auto",
        _type: "doc",
        _version: 1,
        found: true
      })
    );
  });
});
