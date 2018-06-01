import request from "request-promise-native";
import { sync } from "jest-toolkit";
import { createId } from "../utils/tag";
import { EDITOR_AUTH_TOKEN, READONLY_AUTH_TOKEN } from "../utils/cognito-auth";
jest.setTimeout(60000);

describe("tag write authorization", () => {
  const id = createId();
  const tag = { id: `audience/${id}`, label: id };

  it("should fail to create a tag when the user is the readonly user", async () => {
    expect(
      await sync(
        request({
          uri: "http://localhost:3011/tag/audience",
          json: true,
          method: "POST",
          headers: { Authorization: READONLY_AUTH_TOKEN },
          body: { label: id },
          timeout: 30000
        })
      )
    ).toThrow(/readonly user cannot modify system/);
  });

  it("should fail to delete a tag when the user is the readonly user", async () => {
    const result = await request({
      uri: "http://localhost:3011/tag/audience",
      json: true,
      method: "POST",
      headers: { Authorization: EDITOR_AUTH_TOKEN },
      body: { label: id },
      timeout: 30000
    });

    expect(result).toEqual({ tag });

    expect(
      await sync(
        request({
          uri: `http://localhost:3011/tag/audience/${id}`,
          json: true,
          method: "DELETE",
          headers: { Authorization: READONLY_AUTH_TOKEN },
          timeout: 30000
        })
      )
    ).toThrow(/readonly user cannot modify system/);
  });
});
