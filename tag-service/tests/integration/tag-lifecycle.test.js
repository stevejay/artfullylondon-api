"use strict";

const request = require("request-promise-native");
const testUtil = require("./test-util");
const TIMEOUT_MS = 10000;

describe("create-tag", () => {
  const id = testUtil.createIdForTag();
  const tag = { id: `audience/${id}`, label: id };
  const validAuthToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiY29nbml0bzp1c2VybmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ._ANmL9jse6JQCwQJumzBEH6omY7OjFFSFYJdS5wdeZE";

  it(
    "should create a tag",
    async () => {
      let result = await request({
        uri: "http://localhost:3020/tag/audience",
        json: true,
        method: "POST",
        headers: { Authorization: validAuthToken },
        body: { label: id }
      });

      expect(result).toEqual({ tag });

      result = await request({
        uri: "http://localhost:3020/tags/audience",
        json: true,
        method: "GET"
      });

      console.log("result>>>", result);

      expect(result.tags.audience).toEqual(expect.arrayContaining([tag]));
    },
    TIMEOUT_MS
  );

  it(
    "should fail to create the tag again",
    async () => {
      let result = await request({
        uri: "http://localhost:3020/tag/audience",
        json: true,
        method: "POST",
        headers: { Authorization: validAuthToken },
        body: { label: id }
      });

      expect(result).toEqual({});
    },
    TIMEOUT_MS
  );

  it(
    "should delete the tag",
    async () => {
      let result = await request({
        uri: `http://localhost:3020/tag/audience/${id}`,
        json: true,
        method: "DELETE",
        headers: { Authorization: validAuthToken }
      });

      expect(result).toEqual({ acknowledged: true });

      result = await request({
        uri: "http://localhost:3020/tags/audience",
        json: true,
        method: "GET"
      });

      expect(result.tags.audience).not.toEqual(expect.arrayContaining([tag]));
    },
    TIMEOUT_MS
  );
});
