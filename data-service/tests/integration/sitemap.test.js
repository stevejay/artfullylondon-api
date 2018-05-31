import request from "request-promise-native";
import path from "path";
import ESSetup from "./es-setup";

jest.setTimeout(30000);

describe("sitemap handler", () => {
  beforeAll(async () => {
    const esSetup = new ESSetup(
      "http://localhost:4571",
      path.resolve(__dirname, "../../../elasticsearch")
    );

    await esSetup.createIndex("event-full");
    await esSetup.indexDocument("event-full", {
      status: "Active",
      id: "event-one",
      entityType: "event",
      name: "Foo",
      occurrenceType: "Continuous"
    });
    await esSetup.indexDocument("event-full", {
      status: "Active",
      id: "event-two",
      entityType: "event",
      name: "Bar"
    });
  });

  it("should return a successful result", async () => {
    const result = await request("http://localhost:3010/public/sitemap.txt");
    expect(result).toEqual("https://www.artfully.london/event/event-one");
  });
});
