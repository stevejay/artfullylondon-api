import request from "request-promise-native";
import { sync } from "jest-toolkit";
jest.setTimeout(60000);

const PREFERENCES_QUERY = `
{
  preferences {
    emailFrequency
  }
}
`;

describe("authentication", () => {
  it("should fail to read preferences when authentication fails", async () => {
    expect(
      await sync(
        request({
          uri: "http://localhost:3012/graphql",
          json: true,
          method: "POST",
          headers: { Authorization: "Bearer 1234567890" },
          body: { query: PREFERENCES_QUERY },
          timeout: 30000
        })
      )
    ).toThrow(/Unauthorized/);
  });
});
