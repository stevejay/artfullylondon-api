"use strict";

const request = require("request-promise-native");
const testUtil = require("./test-util");

describe("create-tag", () => {
  const id = testUtil.createIdForTag();
  const tag = { id: `audience/${id}`, label: id };

  it("should create a tag", async () => {
    let result = await request({
      uri: "http://localhost:3020/tag/audience",
      json: true,
      method: "POST",
      headers: { Authorization: testUtil.EDITOR_AUTH_TOKEN },
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
      await testUtil.sync(
        request({
          uri: "http://localhost:3020/tag/audience",
          json: true,
          method: "POST",
          headers: { Authorization: testUtil.EDITOR_AUTH_TOKEN },
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
      headers: { Authorization: testUtil.EDITOR_AUTH_TOKEN },
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
