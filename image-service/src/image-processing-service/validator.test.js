import * as validator from "./validator";

describe("validateImageMetadata", () => {
  test.each([
    [{ width: 1000, height: 1000 }],
    [{ width: 10, height: 1000 }],
    [{ width: 1000, height: 10 }]
  ])("should allow %o", metadata => {
    expect(() => validator.validateImageMetadata(metadata)).not.toThrow();
  });

  test.each([[{ width: 10, height: 10 }], [{ width: 10000, height: 10000 }]])(
    "should allow %o",
    metadata => {
      expect(() => validator.validateImageMetadata(metadata)).toThrow(
        /\[400\]/
      );
    }
  );
});
