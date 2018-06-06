import request from "request-promise-native";
import * as elasticsearch from "../utils/elasticsearch";
jest.setTimeout(60000);

describe("basic search", () => {
  beforeAll(async () => {
    await elasticsearch.createIndex("talent-full");
    await elasticsearch.indexDocument("talent-full", {
      status: "Active",
      commonRole: "Director",
      entityType: "talent",
      firstNames: "Carrie",
      id: 1,
      lastName: "Cracknell",
      lastName_sort: "cracknell"
    });
    await elasticsearch.indexDocument("talent-full", {
      status: "Active",
      commonRole: "Actor",
      entityType: "talent",
      firstNames: "Dave",
      id: 2,
      lastName: "Donnelly",
      lastName_sort: "donnelly"
    });
  });

  afterAll(async () => {
    await elasticsearch.deleteIndex("talent-full");
  });

  it("should perform a public search of talents", async () => {
    const result = await request({
      uri:
        "http://localhost:3020/public/search/basic?term=carrie&entityType=talent",
      json: true,
      method: "GET",
      timeout: 30000
    });

    expect(result).toEqual({
      items: [
        {
          commonRole: "Director",
          entityType: "talent",
          firstNames: "Carrie",
          id: 1,
          lastName: "Cracknell",
          status: "Active"
        }
      ],
      params: { entityType: "talent", skip: 0, take: 12, term: "carrie" },
      total: 1
    });
  });
});
