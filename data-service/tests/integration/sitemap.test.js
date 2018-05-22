"use strict";

const request = require("request-promise-native");
const testUtils = require("./utils");

describe("sitemap handler", () => {
  beforeAll(async () => {
    await testUtils.createElasticsearchIndex("event-full");
    await testUtils.indexDocument("event-full", {
      status: "Active",
      id: "event-one",
      entityType: "event",
      name: "Foo",
      occurrenceType: "Continuous"
    });
    await testUtils.indexDocument("event-full", {
      status: "Active",
      id: "event-two",
      entityType: "event",
      name: "Bar"
    });
  });

  afterAll(async () => {
    await testUtils.deleteElasticsearchIndex("event-full");
  });

  it("should return a successful result", async () => {
    const result = await request("http://localhost:3010/public/sitemap.txt");
    expect(result).toEqual("https://www.artfully.london/event/event-one");
  });
});
