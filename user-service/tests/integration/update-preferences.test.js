"use strict";

const jwt = require("jsonwebtoken");
const request = require("request-promise-native");
const testUtils = require("./utils");

// const SECRET = "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq";
const TOKEN =
  // "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FydGZ1bGx5bG9uZG9uLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJlbWFpbHw1ODZhMjQ1ZTBiZGNhYjBhMGVhMGQxMWIiLCJhdWQiOiJXUjlHd0dkMm8zUllGcGtkQm0wcXk4Yk9FbTY4UEdlZyIsImlhdCI6MTUyNjkzMTI4MCwiZXhwIjoxNTI2OTY3MjgwfQ.T3MJ0nVohjggSBCloKy-AUNg7E3KdVNl4ALBfjoHA-M";
  // "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FydGZ1bGx5bG9uZG9uLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJlbWFpbHw1ODZhMjQ1ZTBiZGNhYjBhMGVhMGQxMWIiLCJhdWQiOiJXUjlHd0dkMm8zUllGcGtkQm0wcXk4Yk9FbTY4UEdlZyIsImlhdCI6MTUyNjkzMTI4MCwiZXhwIjoxNTI2OTY3MjgwfQ.qkYLg_TjDjF_um-sEro3JojpCSI6gm6yOaW7nea-XuM";
  // "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FydGZ1bGx5bG9uZG9uLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJlbWFpbHw1ODZhMjQ1ZTBiZGNhYjBhMGVhMGQxMWIiLCJhdWQiOiJhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYSIsImlhdCI6MTUyNjkzMTI4MCwiZXhwIjoxNTI2OTY3MjgwfQ.Q3spk_PsA0AKEwIfY2YvKvsWzTRUub02xab5dJUZ2rE";
  // "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FydGZ1bGx5bG9uZG9uLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJlbWFpbHw1ODZhMjQ1ZTBiZGNhYjBhMGVhMGQxMWIiLCJhdWQiOiJhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYSIsImlhdCI6MTUyNjkzMTI4MCwiZXhwIjo5OTI2OTY3MjgwfQ.oBRCpAL-iywIgsZUAVe5j1EwntXK9X_UAmeXQ28JGWY";
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2FydGZ1bGx5bG9uZG9uLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJlbWFpbHw1ODZhMjQ1ZTBiZGNhYjBhMGVhMGQxMWIiLCJhdWQiOiJhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYSIsImlhdCI6MTUyNjkzMTI4MCwiZXhwIjo5OTI2OTY3MjgwfQ.87wqf7Q-RvspBTkqOenkxLih5we-AlbYdM4e6HY2lyM";

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
