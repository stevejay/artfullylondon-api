import request from "request-promise-native";
import * as elasticsearch from "../utils/elasticsearch";
jest.setTimeout(60000);

describe("sitemap handler", () => {
  beforeAll(async () => {
    await elasticsearch.createIndex("event-full");
    await elasticsearch.indexDocument("event-full", {
      status: "Active",
      id: "event-one",
      entityType: "event",
      name: "Foo",
      occurrenceType: "Continuous"
    });
    await elasticsearch.indexDocument("event-full", {
      status: "Active",
      id: "event-two",
      entityType: "event",
      name: "Bar"
    });
    await elasticsearch.indexDocument("event-full", {
      status: "Deleted",
      id: "event-three",
      entityType: "event",
      name: "Bat",
      occurrenceType: "Continuous"
    });
  });

  it("should return a successful result", async () => {
    const result = await request("http://localhost:3010/public/sitemap.txt");
    expect(result).toEqual("https://www.artfully.london/event/event-one");
  });
});
