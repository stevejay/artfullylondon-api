import * as validator from "./validator";

describe("validateUserForMutation", () => {
  it("should allow an editor user", () => {
    const context = { authorizer: { isEditor: "true" } };
    expect(() => validator.validateUserForMutation(context)).not.toThrow();
  });

  it("should not allow a non-editor user", () => {
    const context = { authorizer: { isEditor: "false" } };
    expect(() => validator.validateUserForMutation(context)).toThrow(
      /User not authorized/
    );
  });
});
