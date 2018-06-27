import * as validator from "./validator";

describe("validateCreateTagRequest", () => {
  it("should allow a valid request", () => {
    const request = { tagType: "audience", label: "Families" };
    expect(() => validator.validateCreateTagRequest(request)).not.toThrow();
  });

  it("should throw on an invalid request", () => {
    const request = { tagType: "invalid", label: "Families" };
    expect(() => validator.validateCreateTagRequest(request)).toThrow(
      /Bad Request/
    );
  });
});

describe("validateUserForMutation", () => {
  it("should allow an editor user", () => {
    const context = { authorizer: { isEditor: true } };
    expect(() => validator.validateUserForMutation(context)).not.toThrow();
  });

  it("should not allow a non-editor user", () => {
    const context = { authorizer: { isEditor: false } };
    expect(() => validator.validateUserForMutation(context)).toThrow(
      /User not authorized/
    );
  });
});
