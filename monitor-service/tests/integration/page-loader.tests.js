"use strict";

const pageLoader = require("../../src/venue-processing/page-loader");
jest.setTimeout(30000);

describe("page-loader", () => {
  describe("staticLoader", () => {
    it("should load a valid url", async () => {
      const $ = await pageLoader.staticLoader("https://www.google.co.uk/");
      expect($("title").text()).toEqual("Google");
    });
  });

  describe("spaLoader", () => {
    it("should load a valid url", async () => {
      const $ = pageLoader.spaLoader("https://www.google.co.uk/");
      expect($("title").text()).toEqual("Google");
    });
  });
});
