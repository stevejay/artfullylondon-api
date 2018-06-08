import request from "request-promise-native";
import * as elasticsearch from "../utils/elasticsearch";
jest.setTimeout(60000);

describe("autocomplete search", () => {
  beforeAll(async () => {
    await elasticsearch.createTemplate("autocomplete");
    await elasticsearch.createIndex("autocomplete");
    await elasticsearch.indexDocument("autocomplete", {
      status: "Active",
      commonRole: "Director",
      entityType: "talent",
      id: 1,
      nameSuggest: "Carrie Cracknell",
      output: "Carrie Cracknell"
    });
    await elasticsearch.indexDocument("autocomplete", {
      status: "Active",
      commonRole: "Actor",
      entityType: "talent",
      id: 2,
      nameSuggest: "Dave Donnelly",
      output: "Dave Donnelly"
    });
    await elasticsearch.indexDocument("autocomplete", {
      status: "Active",
      entityType: "venue",
      venueType: "Theatre",
      address: "59 Some St",
      postcode: "N6 2AA",
      id: 3,
      nameSuggest: "Carrillion Theatre",
      output: "Carrillion Theatre"
    });
  });

  afterAll(async () => {
    await elasticsearch.deleteIndex("autocomplete");
  });

  it("should perform a public search of talents", async () => {
    const result = await request({
      uri:
        "http://localhost:3013/public/search/auto?term=car&entityType=talent",
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

  it("should perform a public search of everything", async () => {
    const result = await request({
      uri: "http://localhost:3013/public/search/auto?term=car",
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
        },
        {
          status: "Active",
          entityType: "venue",
          venueType: "Theatre",
          address: "59 Some St",
          postcode: "N6 2AA",
          id: 3,
          name: "Carrillion Theatre",
          nameSuggest: "Carrillion Theatre",
          output: "Carrillion Theatre"
        }
      ],
      params: { entityType: "all", term: "car" }
    });
  });
});
