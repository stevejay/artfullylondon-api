"use strict";

const jwt = require("jsonwebtoken");
const request = require("request-promise-native");
const testUtils = require("./utils");

// const SECRET = "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq";
const TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FydGZ1bGx5bG9uZG9uLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJlbWFpbHw1ODZhMjQ1ZTBiZGNhYjBhMGVhMGQxMWIiLCJhdWQiOiJXUjlHd0dkMm8zUllGcGtkQm0wcXk4Yk9FbTY4UEdlZyIsImlhdCI6MTUyNjkzMTI4MCwiZXhwIjoxNTI2OTY3MjgwfQ.Z4BeFZ52DmAP_Y8NlHoMf_6LlPH46zAgPW-Bia7bo44";

// const TOKEN_2 = jwt.sign({ foo: "bar" }, SECRET, {
//   algorithm: "HS256",
//   expiresIn: 18000
// });

// console.log("token 2", TOKEN_2);

describe("update preferences", () => {
  it("should update preferences successfully", async () => {
    const response = await request({
      uri: "http://localhost:3020/user/preferences",
      json: true,
      method: "PUT",
      headers: { Authorization: `Bearer ${TOKEN}` },
      body: { emailFrequency: "Daily" },
      timeout: 4000
    });

    expect(response).toEqual({ acknowledged: true });
  });
});

//  [400] {"statusCode":400,"headers":{"Access-Control-Allow-Origin":"*","Access-Control-Allow-Credentials":true},"body":"{\"error\":\"[400] Bad Request: Email Frequency can't be blank\"}"}
