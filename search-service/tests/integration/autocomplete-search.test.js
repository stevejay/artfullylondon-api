import request from "request-promise-native";
import * as elasticsearch from "../utils/elasticsearch";
jest.setTimeout(60000);

describe("autocomplete search", () => {
  beforeAll(async () => {
    await elasticsearch.createIndex("talent-auto");
    await elasticsearch.indexDocument("talent-auto", {
      status: "Active",
      commonRole: "Director",
      entityType: "talent",
      id: 1,
      nameSuggest: "Carrie Cracknell",
      output: "Carrie Cracknell"
    });
    await elasticsearch.indexDocument("talent-auto", {
      status: "Active",
      commonRole: "Actor",
      entityType: "talent",
      id: 2,
      nameSuggest: "Dave Donnelly",
      output: "Dave Donnelly"
    });
  });

  afterAll(async () => {
    await elasticsearch.deleteIndex("talent-auto");
  });

  it("should perform a public search of talents", async () => {
    const result = await request({
      uri:
        "http://localhost:3020/public/search/auto?term=car&entityType=talent",
      json: true,
      method: "GET",
      timeout: 30000
    });

    expect(result).toEqual({
      items: [
        {
          commonRole: "Director",
          entityType: "talent",
          id: 1,
          name: "Carrie Cracknell",
          nameSuggest: "Carrie Cracknell",
          output: "Carrie Cracknell",
          status: "Active"
        }
      ],
      params: { entityType: "talent", term: "car" }
    });
  });
});
