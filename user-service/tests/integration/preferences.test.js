import request from "request-promise-native";
import uuidv4 from "uuid/v4";
import { sync } from "jest-toolkit";
import * as authUtils from "../utils/auth";
jest.setTimeout(60000);

describe("preferences", () => {
  const userId = uuidv4();

  it("should update preferences", async () => {
    const response = await request({
      uri: "http://localhost:3012/user/preferences",
      json: true,
      method: "PUT",
      headers: {
        Authorization: authUtils.createAuthorizationHeaderValue(userId)
      },
      body: { emailFrequency: "Weekly" },
      timeout: 30000
    });

    expect(response).toEqual(
      expect.stringContaining(JSON.stringify({ acknowledged: true }))
    );
  });

  it("should fail to update preferences when body is incomplete", async () => {
    expect(
      await sync(
        request({
          uri: "http://localhost:3012/user/preferences",
          json: true,
          method: "PUT",
          headers: {
            Authorization: authUtils.createAuthorizationHeaderValue(userId)
          },
          body: {},
          timeout: 30000
        })
      )
    ).toThrow(/can't be blank/);
  });

  it("should read preferences", async () => {
    const response = await request({
      uri: "http://localhost:3012/user/preferences",
      json: true,
      method: "GET",
      headers: {
        Authorization: authUtils.createAuthorizationHeaderValue(userId)
      },
      timeout: 30000
    });

    expect(response).toEqual(
      expect.stringContaining(
        JSON.stringify({ preferences: { emailFrequency: "Weekly" } })
      )
    );
  });
});
