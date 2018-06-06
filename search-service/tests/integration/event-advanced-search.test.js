import request from "request-promise-native";
import * as elasticsearch from "../utils/elasticsearch";
jest.setTimeout(60000);

describe("event advanced search", () => {
  beforeAll(async () => {
    await elasticsearch.createIndex("event-full");
    await elasticsearch.indexDocument("event-full", {
      status: "Active",
      id: 1,
      entityType: "event",
      name: "Foo"
    });
    await elasticsearch.indexDocument("event-full", {
      status: "Active",
      id: 2,
      entityType: "event",
      name: "Bar"
    });
  });

  afterAll(async () => {
    await elasticsearch.deleteIndex("event-full");
  });

  it("should perform a public search", async () => {
    const result = await request({
      uri: "http://localhost:3020/public/search/event?term=foo",
      json: true,
      method: "GET",
      timeout: 30000
    });

    expect(result).toEqual({
      items: [{ entityType: "event", id: 1, name: "Foo", status: "Active" }],
      params: { entityType: "event", skip: 0, take: 12, term: "foo" },
      total: 1
    });
  });
});
