import * as authorizer from "./authorizer";

describe("checkUserIsAuthorizedForMutation", () => {
  it("should allow an editor user", () => {
    const context = { authorizer: { isEditor: true } };
    expect(() =>
      authorizer.checkUserIsAuthorizedForMutation(context)
    ).not.toThrow();
  });

  it("should not allow a non-editor user", () => {
    const context = { authorizer: { isEditor: false } };
    expect(() => authorizer.checkUserIsAuthorizedForMutation(context)).toThrow(
      /User not authorized/
    );
  });
});
