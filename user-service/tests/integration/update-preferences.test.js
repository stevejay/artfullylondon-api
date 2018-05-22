"use strict";

const request = require("request-promise-native");
const testUtils = require("./utils");

describe("update preferences", () => {
  it("should update preferences successfully", async () => {
    const response = await request({
      uri: "http://localhost:3020/user/preferences",
      json: true,
      method: "PUT",
      headers: { Authorization: testUtils.createAuthValue() },
      body: { emailFrequency: "Weekly" },
      timeout: 4000
    });

    expect(response).toEqual({ acknowledged: true });
  });

  it("should read preferences successfully", async () => {
    const response = await request({
      uri: "http://localhost:3020/user/preferences",
      json: true,
      method: "GET",
      headers: { Authorization: testUtils.createAuthValue() },
      timeout: 4000
    });

    expect(response).toEqual({ preferences: { emailFrequency: "Weekly" } });
  });
});

//  [400] {"statusCode":400,"headers":{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Credentials":true},"body":"{\"error\":\"[400] Bad Request: Email Frequency can't be blank\"}"}
