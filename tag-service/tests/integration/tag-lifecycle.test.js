import request from "request-promise-native";
import { sync } from "jest-toolkit";
import { createTestTagId } from "../utils/id-generator";
import { EDITOR_AUTH_TOKEN } from "../utils/cognito-auth";
import { truncateTagTable } from "../utils/dynamodb";
jest.setTimeout(60000);

describe("tag lifecycle", () => {
  const id = createTestTagId();
  const tag = { id: `audience/${id}`, label: id };

  beforeAll(async () => {
    await truncateTagTable("artfullylondon-development-tag");
  });

  it("should create a tag", async () => {
    let result = await request({
      uri: "http://localhost:3011/tag/audience",
      json: true,
      method: "POST",
      headers: { Authorization: EDITOR_AUTH_TOKEN },
      body: { label: id },
      timeout: 30000
    });

    expect(result).toEqual(`{body=${JSON.stringify({ tag })}}`);

    result = await request({
      uri: "http://localhost:3011/tags/audience",
      json: true,
      method: "GET",
      timeout: 30000
    });

    expect(result).toEqual(
      expect.stringContaining(JSON.stringify({ tags: { audience: [tag] } }))
    );
  });

  it("should fail to create a duplicate tag", async () => {
    expect(
      await sync(
        request({
          uri: "http://localhost:3011/tag/audience",
          json: true,
          method: "POST",
          headers: { Authorization: EDITOR_AUTH_TOKEN },
          body: { label: id },
          timeout: 30000
        })
      )
    ).toThrow(/Stale Data/);
  });

  it("should delete the tag", async () => {
    let result = await request({
      uri: `http://localhost:3011/tag/audience/${id}`,
      json: true,
      method: "DELETE",
      headers: { Authorization: EDITOR_AUTH_TOKEN },
      timeout: 30000
    });

    expect(result).toEqual(`{body=${JSON.stringify({ acknowledged: true })}}`);

    result = await request({
      uri: "http://localhost:3011/tags/audience",
      json: true,
      method: "GET",
      timeout: 30000
    });

    expect(result).toEqual(
      expect.stringContaining(JSON.stringify({ tags: {} }))
    );
  });
});
