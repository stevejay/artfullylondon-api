import request from "request-promise-native";
import { truncateTagTable } from "../utils/dynamodb";
import * as authUtils from "../utils/authentication";
import MockJwksServer from "../utils/mock-jwks-server";
jest.setTimeout(60000);

describe("tag graphql querying", () => {
  const mockJwksServer = new MockJwksServer();

  beforeAll(async () => {
    await truncateTagTable("artfullylondon-development-tag");
    mockJwksServer.start(3021);
  });

  afterAll(async () => {
    mockJwksServer.stop();
  });

  it("should support adding a tag", async () => {
    const result = await request({
      uri: "http://localhost:3011/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createEditorAuthToken() },
      body: {
        query:
          'mutation { createTag(input: { tag: { tagType: geo, label: "USA" } }) { tag { tagType, id, label } } }'
      },
      timeout: 30000
    });

    expect(result).toEqual({
      data: {
        createTag: {
          tag: {
            id: "geo/usa",
            label: "usa",
            tagType: "geo"
          }
        }
      }
    });
  });

  it("should fail to add a tag using the readonly user", async () => {
    const result = await request({
      uri: "http://localhost:3011/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createReaderAuthToken() },
      body: {
        query:
          'mutation { createTag(input: { tag: { tagType: geo, label: "Mexico" } }) { tag { tagType, id, label } } }'
      },
      timeout: 30000
    });

    expect(result).toEqual({
      data: {
        createTag: null
      },
      errors: [
        expect.objectContaining({
          message: "[401] User not authorized for requested action",
          path: ["createTag"]
        })
      ]
    });
  });

  it("should fail to delete a tag using the readonly user", async () => {
    const result = await request({
      uri: "http://localhost:3011/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createReaderAuthToken() },
      body: {
        query:
          'mutation { deleteTag(input: { tag: { id: "geo/usa" } }) { ok } }'
      },
      timeout: 30000
    });

    expect(result).toEqual({
      data: {
        deleteTag: null
      },
      errors: [
        expect.objectContaining({
          message: "[401] User not authorized for requested action",
          path: ["deleteTag"]
        })
      ]
    });
  });

  it("should support deleting a tag", async () => {
    const result = await request({
      uri: "http://localhost:3011/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createEditorAuthToken() },
      body: {
        query:
          'mutation { deleteTag(input: { tag: { id: "geo/usa" } }) { ok } }'
      },
      timeout: 30000
    });

    expect(result).toEqual({
      data: {
        deleteTag: {
          ok: true
        }
      }
    });
  });
});
