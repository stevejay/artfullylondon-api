import * as auth from "./___auth";
import {
  EDITOR_AUTH_TOKEN,
  READONLY_AUTH_TOKEN
} from "../../tests/utils/cognito-auth";

describe("isReadonlyUser", () => {
  it("should detect a readonly user", () => {
    const event = { authorization: READONLY_AUTH_TOKEN };
    expect(auth.isReadonlyUser(event)).toEqual(true);
  });

  it("should detect a non-readonly user", () => {
    const event = { authorization: EDITOR_AUTH_TOKEN };
    expect(auth.isReadonlyUser(event)).toEqual(false);
  });
});
