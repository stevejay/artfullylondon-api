import * as validator from "./validator";

describe("validateRefreshSearchIndexRequest", () => {
  it("should pass valid params", () => {
    const params = { entityType: "event" };
    expect(() =>
      validator.validateRefreshSearchIndexRequest(params)
    ).not.toThrow();
  });

  it("should fail invalid params", () => {
    const params = { entityType: "foo" };
    expect(() => validator.validateRefreshSearchIndexRequest(params)).toThrow(
      /\[400\] Bad Request/
    );
  });
});
