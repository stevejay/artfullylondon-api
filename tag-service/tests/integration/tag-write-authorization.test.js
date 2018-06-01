"use strict";

const request = require("request-promise-native");
const testUtils = require("./utils");
jest.setTimeout(60000);

describe("tag write authorization", () => {
  const id = testUtils.createIdForTag();
  const tag = { id: `audience/${id}`, label: id };

  it("should fail to create a tag when the user is the readonly user", async () => {
    expect(
      await testUtils.sync(
        request({
          uri: "http://localhost:3011/tag/audience",
          json: true,
          method: "POST",
          headers: { Authorization: testUtils.READONLY_AUTH_TOKEN },
          body: { label: id },
          timeout: 30000
        })
      )
    ).toThrow(/readonly user cannot modify system/);
  });

  it("should fail to delete a tag when the user is the readonly user", async () => {
    const result = await request({
      uri: "http://localhost:3011/tag/audience",
      json: true,
      method: "POST",
      headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
      body: { label: id },
      timeout: 30000
    });

    expect(result).toEqual({ tag });

    expect(
      await testUtils.sync(
        request({
          uri: `http://localhost:3011/tag/audience/${id}`,
          json: true,
          method: "DELETE",
          headers: { Authorization: testUtils.READONLY_AUTH_TOKEN },
          timeout: 30000
        })
      )
    ).toThrow(/readonly user cannot modify system/);
  });
});
