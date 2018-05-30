"use strict";

const id = require("./id");

describe("id", () => {
  describe("createErrorKey", () => {
    it("should create an error key", () => {
      const actual = id.createErrorKey("SomeActionId", 12345678);
      expect(actual).toEqual("SomeActionId_12345678");
    });
  });
});
