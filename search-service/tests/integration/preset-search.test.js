import request from "request-promise-native";
import * as elasticsearch from "../utils/elasticsearch";
jest.setTimeout(60000);

describe("preset search", () => {
  beforeAll(async () => {
    await elasticsearch.createIndex("talent-full");
    await elasticsearch.createIndex("venue-full");
    await elasticsearch.createIndex("event-full");
    await elasticsearch.createIndex("event-series-full");

    await elasticsearch.indexDocument("talent-full", {
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
    await elasticsearch.deleteIndex("talent-full");
    await elasticsearch.deleteIndex("venue-full");
    await elasticsearch.deleteIndex("event-full");
    await elasticsearch.deleteIndex("event-series-full");
  });

  it("should perform an entity count preset search", async () => {
    const result = await request({
      uri: "http://localhost:3013/public/search/preset/entity-counts",
      json: true,
      method: "GET",
      timeout: 30000
    });

    expect(result).toEqual({
      items: [
        { count: 0, entityType: "event" },
        { count: 0, entityType: "event-series" },
        { count: 1, entityType: "talent" },
        { count: 0, entityType: "venue" }
      ],
      params: { name: "entity-counts" }
    });
  });
});
