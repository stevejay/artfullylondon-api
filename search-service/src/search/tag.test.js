"use strict";

const tag = require("./tag");

describe("tag", () => {
  describe("createTagIdForMediumWithStyleTag", () => {
    it("should create the tag id", () => {
      const actual = tag.createTagIdForMediumWithStyleTag(
        "medium/painting",
        "style/contemporary"
      );

      expect(actual).toEqual("medium/painting/contemporary");
    });
  });
});
