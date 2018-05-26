"use strict";

const request = require("request-promise-native");
const delay = require("delay");
const testUtils = require("./utils");
jest.setTimeout(30000);

describe("event", () => {
  let testVenueId = null;
  let testTalentId = null;
  let testEventSeriesId = null;
  let testEventId = null;
  const testVenueBody = testUtils.createNewVenueBody();
  const testTalentBody = testUtils.createNewTalentBody();
  const testEventSeriesBody = testUtils.createNewEventSeriesBody();
  let testEventBody = null;

  beforeAll(async () => {
    await testUtils.createElasticsearchIndex("venue-full");
    await testUtils.createElasticsearchIndex("venue-auto");
    await testUtils.createElasticsearchIndex("talent-full");
    await testUtils.createElasticsearchIndex("talent-auto");
    await testUtils.createElasticsearchIndex("event-series-full");
    await testUtils.createElasticsearchIndex("event-series-auto");
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

    response = await request({
      uri: "http://localhost:3030/admin/event-series",
      json: true,
      method: "POST",
      headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
      body: testEventSeriesBody,
      timeout: 14000
    });

    testEventSeriesId = response.entity.id;

    testEventBody = testUtils.createNewEventBody(
      testVenueId,
      testTalentId,
      testEventSeriesId
    );
  });

  afterAll(async () => {
    await testUtils.deleteElasticsearchIndex("venue-full");
    await testUtils.deleteElasticsearchIndex("venue-auto");
    await testUtils.deleteElasticsearchIndex("talent-full");
    await testUtils.deleteElasticsearchIndex("talent-auto");
    await testUtils.deleteElasticsearchIndex("event-series-full");
    await testUtils.deleteElasticsearchIndex("event-series-auto");
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

    expect(response.entity.venue.id).toEqual(testVenueId);
    expect(response.entity.talents[0].id).toEqual(testTalentId);
    expect(response.entity.eventSeries.id).toEqual(testEventSeriesId);

    testEventId = response.entity.id;

    // Allow time for the SNS search index update message to be processed.
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

    expect(response.body.entity.venue.id).toEqual(testVenueId);
    expect(response.body.entity.talents[0].id).toEqual(testTalentId);
    expect(response.body.entity.eventSeries.id).toEqual(testEventSeriesId);
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

    expect(response.body.entity.venue.id).toEqual(testVenueId);
    expect(response.body.entity.talents[0].id).toEqual(testTalentId);
    expect(response.body.entity.eventSeries.id).toEqual(testEventSeriesId);
  });

  it("should get the event using the get multi endpoint", async () => {
    const response = await request({
      uri:
        "http://localhost:3030/public/event?ids=" +
        encodeURIComponent(testEventId),
      json: true,
      method: "GET",
      timeout: 14000
    });

    expect(response.entities.length).toEqual(1);

    expect(response.entities[0]).toEqual(
      expect.objectContaining({
        id: testEventId,
        eventType: "Exhibition",
        occurrenceType: "Bounded",
        costType: "Free",
        entityType: "event",
        status: "Active"
      })
    );

    expect(response.entities[0].venueId).toEqual(testVenueId);
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

    expect(response._source).toEqual(
      expect.objectContaining({
        postcode: "N1 1TA",
        venueId: testVenueId,
        eventSeriesId: testEventSeriesId,
        talents: [testTalentId]
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

    expect(response._source).toEqual(
      expect.objectContaining({
        id: testEventId,
        eventType: "Exhibition"
      })
    );
  });

  it("should reject a stale update to the event", async () => {
    expect(
      await testUtils.sync(
        request({
          uri: "http://localhost:3030/admin/event/" + testEventId,
          json: true,
          method: "PUT",
          headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
          body: testEventBody,
          timeout: 14000
        })
      )
    ).toThrow(/Stale Data/);
  });

  it("should accept a valid update to the event", async () => {
    const response = await request({
      uri: "http://localhost:3030/admin/event/" + testEventId,
      json: true,
      method: "PUT",
      headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
      body: {
        ...testEventBody,
        duration: "02:00",
        version: 2
      },
      timeout: 14000
    });

    expect(response.entity).toEqual(
      expect.objectContaining({
        id: testEventId,
        duration: "02:00",
        status: "Active",
        version: 2
      })
    );

    expect(response.entity.venue.id).toEqual(testVenueId);
    expect(response.entity.talents[0].id).toEqual(testTalentId);
    expect(response.entity.eventSeries.id).toEqual(testEventSeriesId);

    // Allow time for the SNS search index update message to be processed.
    await delay(5000);
  });

  it("should put the updated event in elasticsearch", async () => {
    let response = await testUtils.getDocument("event-full", testEventId);

    expect(response).toEqual(
      expect.objectContaining({
        _id: testEventId,
        _index: "event-full",
        _type: "doc",
        _version: 2,
        found: true
      })
    );

    expect(response._source).toEqual(
      expect.objectContaining({
        venueId: testVenueId,
        eventSeriesId: testEventSeriesId,
        talents: [testTalentId]
      })
    );

    response = await testUtils.getDocument("combined-event-auto", testEventId);

    expect(response).toEqual(
      expect.objectContaining({
        _id: testEventId,
        _index: "combined-event-auto",
        _type: "doc",
        _version: 2,
        found: true
      })
    );

    expect(response._source).toEqual(
      expect.objectContaining({
        id: testEventId,
        eventType: "Exhibition"
      })
    );
  });

  it("should fail to get a non-existent event", async () => {
    expect(
      await testUtils.sync(
        request({
          uri: "http://localhost:3030/public/event/does/not/exist",
          json: true,
          method: "GET",
          timeout: 14000,
          resolveWithFullResponse: true
        })
      )
    ).toThrow(/Entity Not Found/);
  });

  it("should refresh the event-full search index", async () => {
    await testUtils.createElasticsearchIndex("event-full");

    let response = await request({
      uri: "http://localhost:3030/admin/search/event-full/latest/refresh",
      json: true,
      method: "POST",
      headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
      timeout: 14000
    });

    expect(response).toEqual({ acknowledged: true });

    await delay(5000);

    response = await testUtils.getDocument("event-full", testEventId);

    expect(response).toEqual(
      expect.objectContaining({
        _id: testEventId,
        _index: "event-full",
        _type: "doc",
        _version: 2,
        found: true
      })
    );
  });

  it("should refresh the combined-event-auto search index", async () => {
    await testUtils.createElasticsearchIndex("combined-event-auto");

    let response = await request({
      uri:
        "http://localhost:3030/admin/search/combined-event-auto/latest/refresh",
      json: true,
      method: "POST",
      headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
      timeout: 14000
    });

    expect(response).toEqual({ acknowledged: true });

    await delay(5000);

    response = await testUtils.getDocument("combined-event-auto", testEventId);

    expect(response).toEqual(
      expect.objectContaining({
        _id: testEventId,
        _index: "combined-event-auto",
        _type: "doc",
        _version: 2,
        found: true
      })
    );
  });

  it("should update the event when the venue entity updates", async () => {
    await request({
      uri: "http://localhost:3030/admin/venue/" + testVenueId,
      json: true,
      method: "PUT",
      headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
      body: {
        ...testVenueBody,
        postcode: "N8 0KL",
        version: 2
      },
      timeout: 14000
    });

    // Allow time for the search index update message to be processed.
    await delay(5000);

    const response = await testUtils.getDocument("event-full", testEventId);

    expect(response).toEqual(
      expect.objectContaining({
        _id: testEventId,
        _index: "event-full",
        _type: "doc",
        _version: 2,
        found: true
      })
    );

    expect(response._source).toEqual(
      expect.objectContaining({
        postcode: "N8 0KL",
        venueId: testVenueId,
        eventSeriesId: testEventSeriesId,
        talents: [testTalentId]
      })
    );
  });

  it("should update the event when the event series entity updates", async () => {
    await request({
      uri: "http://localhost:3030/admin/event-series/" + testEventSeriesId,
      json: true,
      method: "PUT",
      headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
      body: {
        ...testEventSeriesBody,
        name: "New Event Series Name",
        version: 2
      },
      timeout: 14000
    });

    // Allow time for the search index update message to be processed.
    await delay(5000);

    const response = await testUtils.getDocument("event-full", testEventId);

    expect(response).toEqual(
      expect.objectContaining({
        _id: testEventId,
        _index: "event-full",
        _type: "doc",
        _version: 2,
        found: true
      })
    );

    expect(response._source).toEqual(
      expect.objectContaining({
        venueId: testVenueId,
        eventSeriesId: testEventSeriesId,
        talents: [testTalentId]
      })
    );
  });
});
