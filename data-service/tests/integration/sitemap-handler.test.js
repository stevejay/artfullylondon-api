import request from "request-promise-native";
import path from "path";
import ESTestClient from "./es-test-client";

jest.setTimeout(60000);

describe("sitemap handler", () => {
  beforeAll(async () => {
    const esTestClient = new ESTestClient(
      "http://localhost:4571",
      path.resolve(__dirname, "../../../elasticsearch")
    );

    await esTestClient.createIndex("event-full");
    await esTestClient.indexDocument("event-full", {
      status: "Active",
      id: "event-one",
      entityType: "event",
      name: "Foo",
      occurrenceType: "Continuous"
    });
    await esTestClient.indexDocument("event-full", {
      status: "Active",
      id: "event-two",
      entityType: "event",
      name: "Bar"
    });
    await esTestClient.indexDocument("event-full", {
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
