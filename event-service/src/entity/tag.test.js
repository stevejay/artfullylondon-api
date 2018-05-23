"use strict";

const tag = require("./tag");

describe("tag", () => {
  describe("createMediumWithStyleTag", () => {
    const tests = [
      {
        args: {
          mediumTag: { id: "medium/architecture", label: "architecture" },
          styleTag: { id: "style/surreal", label: "surreal" }
        },
        expected: {
          id: "medium/architecture/surreal",
          label: "surreal architecture"
        }
      }
    ];

    tests.map(test => {
      it(`should return ${JSON.stringify(
        test.expected
      )} when passed ${JSON.stringify(test.args)}`, () => {
        const result = tag.createMediumWithStyleTag(
          test.args.mediumTag,
          test.args.styleTag
        );

        expect(result).toEqual(test.expected);
      });
    });
  });
});
