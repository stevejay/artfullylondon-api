import * as id from "./id";

describe("id", () => {
  describe("createTagIdFromLabel", () => {
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
        () => {
          expect(
            id.createTagIdFromLabel(test.args.prefix, test.args.label)
          ).toEqual(test.expected);
        }
      );
    });
  });

  describe("createTagId", () => {
    it("should return valid id from id parts", () => {
      expect(id.createTagId("medium", "theatre", "immersive")).toEqual(
        "medium/theatre/immersive"
      );
    });
  });
});
