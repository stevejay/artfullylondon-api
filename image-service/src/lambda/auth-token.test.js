import * as authToken from "./auth-token";

describe("getFromEvent", () => {
  it("should get the token from the event", () => {
    const result = authToken.getFromEvent({
      headers: { Authorization: "Bearer 12345678" }
    });
    expect(result).toEqual("12345678");
  });
});
