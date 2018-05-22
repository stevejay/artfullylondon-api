"use strict";

const request = require("request-promise-native");
const uuidv4 = require("uuid/v4");
const testUtils = require("./utils");

describe("authentication", () => {
  it("should fail to read preferences when authentication fails", async () => {
    expect(
      await testUtils.sync(
        request({
          uri: "http://localhost:3020/user/preferences",
          json: true,
          method: "GET",
          headers: { Authorization: "Bearer 1234567890" },
          timeout: 4000
        })
      )
    ).toThrow(/Unauthorized/);
  });
});
