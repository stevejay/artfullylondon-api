"use strict";

const id = require("./id");

describe("id", function() {
  describe("createTagIdFromLabel", function() {
    const tests = [
      {
        args: { prefix: "geo", label: "Furious Five" },
        expected: "geo/furious-five"
      },
      {
        args: { prefix: "medium", label: "theatre" },
        expected: "medium/theatre"
      }
    ];

    tests.forEach(test => {
      it(
        "should return " +
          JSON.stringify(test.expected) +
          " for args " +
          JSON.stringify(test.args),
        function() {
          expect(
            id.createTagIdFromLabel(test.args.prefix, test.args.label)
          ).toEqual(test.expected);
        }
      );
    });
  });

  describe("createTagId", function() {
    it("should return valid id from id parts", function() {
      expect(id.createTagId("medium", "theatre", "immersive")).toEqual(
        "medium/theatre/immersive"
      );
    });
  });
});
