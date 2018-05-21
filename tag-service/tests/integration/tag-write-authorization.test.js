"use strict";

const request = require("request-promise-native");
const testUtil = require("./test-util");

describe("create-tag", () => {
  const id = testUtil.createIdForTag();
  const tag = { id: `audience/${id}`, label: id };

  it("should fail to create a tag when the user is the readonly user", async () => {
    expect(
      await testUtil.sync(
        request({
          uri: "http://localhost:3020/tag/audience",
          json: true,
          method: "POST",
          headers: { Authorization: testUtil.READONLY_AUTH_TOKEN },
          body: { label: id },
          timeout: 4000
        })
      )
    ).toThrow(/readonly user cannot modify system/);
  });

  it("should fail to delete a tag when the user is the readonly user", async () => {
    const result = await request({
      uri: "http://localhost:3020/tag/audience",
      json: true,
      method: "POST",
      headers: { Authorization: testUtil.EDITOR_AUTH_TOKEN },
      body: { label: id },
      timeout: 4000
    });

    expect(result).toEqual({ tag });

    expect(
      await testUtil.sync(
        request({
          uri: `http://localhost:3020/tag/audience/${id}`,
          json: true,
          method: "DELETE",
          headers: { Authorization: testUtil.READONLY_AUTH_TOKEN },
          timeout: 4000
        })
      )
    ).toThrow(/readonly user cannot modify system/);
  });
});
