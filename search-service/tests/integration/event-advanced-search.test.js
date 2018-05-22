"use strict";

const request = require("request-promise-native");
const testUtils = require("./utils");

describe("event advanced search", () => {
  beforeAll(async () => {
    await testUtils.createElasticsearchIndex("event-full");
    await testUtils.indexDocument("event-full", {
      status: "Active",
      id: 1,
      entityType: "event",
      name: "Foo"
    });
    await testUtils.indexDocument("event-full", {
      status: "Active",
      id: 2,
      entityType: "event",
      name: "Bar"
    });
  });

  afterAll(async () => {
    await testUtils.deleteElasticsearchIndex("event-full");
  });

  it("should perform a public search", async () => {
    const result = await request({
      uri: "http://localhost:3020/public/search/event?term=foo",
      json: true,
      method: "GET",
      timeout: 4000
    });

    expect(result).toEqual({
      items: [{ entityType: "event", id: 1, name: "Foo", status: "Active" }],
      params: { entityType: "event", skip: 0, take: 12, term: "foo" },
      total: 1
    });
  });
});
