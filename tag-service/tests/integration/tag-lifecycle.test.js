"use strict";

const request = require("request-promise-native");
const testUtils = require("./utils");

describe("create-tag", () => {
  const id = testUtils.createIdForTag();
  const tag = { id: `audience/${id}`, label: id };

  it("should create a tag", async () => {
    let result = await request({
      uri: "http://localhost:3020/tag/audience",
      json: true,
      method: "POST",
      headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
      body: { label: id },
      timeout: 4000
    });

    expect(result).toEqual({ tag });

    result = await request({
      uri: "http://localhost:3020/tags/audience",
      json: true,
      method: "GET",
      timeout: 4000
    });

    expect(result.tags.audience).toEqual(expect.arrayContaining([tag]));
  });

  it("should fail to create a duplicate tag", async () => {
    expect(
      await testUtils.sync(
        request({
          uri: "http://localhost:3020/tag/audience",
          json: true,
          method: "POST",
          headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
          body: { label: id },
          timeout: 4000
        })
      )
    ).toThrow(/Stale Data/);
  });

  it("should delete the tag", async () => {
    let result = await request({
      uri: `http://localhost:3020/tag/audience/${id}`,
      json: true,
      method: "DELETE",
      headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
      timeout: 4000
    });

    expect(result).toEqual({ acknowledged: true });

    result = await request({
      uri: "http://localhost:3020/tags/audience",
      json: true,
      method: "GET",
      timeout: 4000
    });

    expect(result.tags.audience).not.toEqual(expect.arrayContaining([tag]));
  });
});
