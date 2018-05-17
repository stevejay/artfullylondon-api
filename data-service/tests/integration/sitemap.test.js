"use strict";

const request = require("request-promise-native");

describe("sitemap-handler", () => {
  it("should return a successful result", async () => {
    const result = await request("http://localhost:3010/public/sitemap.txt");
    expect(result).toEqual("");
  });
});
