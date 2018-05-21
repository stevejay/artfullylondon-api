"use strict";

const jwt = require("jsonwebtoken");
const request = require("request-promise-native");
const testUtils = require("./utils");

const VALID_TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FydGZ1bGx5bG9uZG9uLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJlbWFpbHw1ODZhMjQ1ZTBiZGNhYjBhMGVhMGQxMWIiLCJhdWQiOiJhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYSIsImlhdCI6MTUyNjkzMTI4MCwiZXhwIjo5OTI2OTY3MjgwfQ.87wqf7Q-RvspBTkqOenkxLih5we-AlbYdM4e6HY2lyM";

describe("update preferences", () => {
  it("should update preferences successfully", async () => {
    const response = await request({
      uri: "http://localhost:3020/user/preferences",
      json: true,
      method: "PUT",
      headers: { Authorization: `Bearer ${VALID_TOKEN}` },
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
      headers: { Authorization: `Bearer ${VALID_TOKEN}` },
      timeout: 4000
    });

    expect(response).toEqual({ preferences: { emailFrequency: "Weekly" } });
  });
});

//  [400] {"statusCode":400,"headers":{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Credentials":true},"body":"{\"error\":\"[400] Bad Request: Email Frequency can't be blank\"}"}
