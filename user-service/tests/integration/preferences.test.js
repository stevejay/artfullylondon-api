"use strict";

const request = require("request-promise-native");
const uuidv4 = require("uuid/v4");
const testUtils = require("./utils");

describe("preferences", () => {
  const userId = uuidv4();

  it("should update preferences", async () => {
    const response = await request({
      uri: "http://localhost:3020/user/preferences",
      json: true,
      method: "PUT",
      headers: { Authorization: testUtils.createAuthValue(userId) },
      body: { emailFrequency: "Weekly" },
      timeout: 4000
    });

    expect(response).toEqual({ acknowledged: true });
  });

  it("should fail to update preferences when body is incomplete", async () => {
    expect(
      await testUtils.sync(
        request({
          uri: "http://localhost:3020/user/preferences",
          json: true,
          method: "PUT",
          headers: { Authorization: testUtils.createAuthValue(userId) },
          body: {},
          timeout: 4000
        })
      )
    ).toThrow(/can't be blank/);
  });

  it("should read preferences", async () => {
    const response = await request({
      uri: "http://localhost:3020/user/preferences",
      json: true,
      method: "GET",
      headers: { Authorization: testUtils.createAuthValue(userId) },
      timeout: 4000
    });

    expect(response).toEqual({ preferences: { emailFrequency: "Weekly" } });
  });
});
