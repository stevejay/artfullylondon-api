import request from "request-promise-native";
import { sync } from "jest-toolkit";
jest.setTimeout(60000);

describe("authentication", () => {
  it("should fail to read preferences when authentication fails", async () => {
    expect(
      await sync(
        request({
          uri: "http://localhost:3012/user/preferences",
          json: true,
          method: "GET",
          headers: { Authorization: "Bearer 1234567890" },
          timeout: 30000
        })
      )
    ).toThrow(/Unauthorized/);
  });
});
