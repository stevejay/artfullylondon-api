"use strict";

const request = require("request-promise-native");
const testUtils = require("./utils");

describe("preset search", () => {
  beforeAll(async () => {
    await testUtils.createElasticsearchIndex("talent-full");
    await testUtils.createElasticsearchIndex("venue-full");
    await testUtils.createElasticsearchIndex("event-full");
    await testUtils.createElasticsearchIndex("event-series-full");

    await testUtils.indexDocument("talent-full", {
      status: "Active",
      commonRole: "Director",
      entityType: "talent",
      firstNames: "Carrie",
      id: 1,
      lastName: "Cracknell",
      lastName_sort: "cracknell"
    });
  });

  afterAll(async () => {
    await testUtils.deleteElasticsearchIndex("talent-full");
    await testUtils.deleteElasticsearchIndex("venue-full");
    await testUtils.deleteElasticsearchIndex("event-full");
    await testUtils.deleteElasticsearchIndex("event-series-full");
  });

  it("should perform an entity count preset search", async () => {
    const result = await request({
      uri: "http://localhost:3020/public/search/preset/entity-counts",
      json: true,
      method: "GET",
      timeout: 4000
    });

    expect(result).toEqual({
      items: [
        { count: 0, entityType: "event" },
        { count: 0, entityType: "event-series" },
        { count: 1, entityType: "talent" },
        { count: 0, entityType: "venue" }
      ],
      params: { id: null, name: "entity-counts" }
    });
  });
});
