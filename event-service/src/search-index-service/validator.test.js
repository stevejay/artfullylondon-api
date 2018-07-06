import * as validator from "./validator";
import * as entityType from "../types/entity-type";

describe("validateRefreshSearchIndexRequest", () => {
  it("should pass valid params", () => {
    const params = { entityType: entityType.EVENT };
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
