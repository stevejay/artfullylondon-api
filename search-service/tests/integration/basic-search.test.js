"use strict";

const request = require("request-promise-native");
const testUtils = require("./utils");

describe("basic search", () => {
  beforeAll(async () => {
    await testUtils.createElasticsearchIndex("talent-full");
    await testUtils.indexDocument("talent-full", {
      status: "Active",
      commonRole: "Director",
      entityType: "talent",
      firstNames: "Carrie",
      id: 1,
      lastName: "Cracknell",
      lastName_sort: "cracknell"
    });
    await testUtils.indexDocument("talent-full", {
      status: "Active",
      commonRole: "Actor",
      entityType: "talent",
      firstNames: "Dave",
      id: 2,
      lastName: "Donnelly",
      lastName_sort: "donnelly"
    });
  });

  // afterAll(async () => {
  //   await testUtils.deleteElasticsearchIndex("talent-full");
  // });

  it("should perform a public basic search of talents", async () => {
    const result = await request({
      uri:
        "http://localhost:3020/public/search/basic?term=carrie&entityType=talent",
      json: true,
      method: "GET",
      timeout: 4000
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
