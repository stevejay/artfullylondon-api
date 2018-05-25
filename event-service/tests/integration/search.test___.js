"use strict";

const request = require("request-promise-native");
const delay = require("delay");
const testUtils = require("./utils");
jest.setTimeout(15000);

describe("search", () => {
  beforeAll(async () => {
    await testUtils.createElasticsearchIndex("talent-full");
    await testUtils.createElasticsearchIndex("talent-auto");
    await testUtils.truncateAllTables();
  });

  afterAll(async () => {
    await testUtils.deleteElasticsearchIndex("talent-full");
    await testUtils.deleteElasticsearchIndex("talent-auto");
  });

  it("should refresh the talent-full index", async () => {
    const response = await request({
      uri: "http://localhost:3030/admin/search/talent-full/latest/refresh",
      json: true,
      method: "POST",
      headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
      timeout: 14000
    });

    expect(response).toEqual({ acknowledged: true });

    await delay(5000);
  });
});
