import request from "request-promise-native";
import { addToTable, truncateTagTable } from "../utils/dynamodb";
import MockJwksServer from "../utils/mock-jwks-server";
import * as authUtils from "../utils/authentication";
import * as tagType from "../../src/tag-type";
jest.setTimeout(60000);

describe("tag graphql querying", () => {
  const mockJwksServer = new MockJwksServer();

  beforeAll(async () => {
    await truncateTagTable("artfullylondon-development-tag");
    await addToTable("artfullylondon-development-tag", {
      tagType: tagType.AUDIENCE,
      id: "audience/families",
      label: "families"
    });
    await addToTable("artfullylondon-development-tag", {
      tagType: tagType.GEO,
      id: "geo/usa",
      label: "usa"
    });
    mockJwksServer.start(3021);
  });

  afterAll(async () => {
    mockJwksServer.stop();
  });

  it("should support querying of all tags", async () => {
    const result = await request({
      uri: "http://localhost:3011/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createEditorAuthToken() },
      body: { query: "{ tags { audience { label } geo { label } } }" },
      timeout: 30000,
      resolveWithFullResponse: true
    });

    expect(result.headers).toEqual(
      expect.objectContaining({
        "access-control-allow-credentials": "true",
        "access-control-allow-origin": "*"
      })
    );

    expect(result.body).toEqual({
      data: {
        tags: {
          geo: [
            {
              label: "usa"
            }
          ],
          audience: [
            {
              label: "families"
            }
          ]
        }
      }
    });
  });

  it("should support querying of tags by tag type", async () => {
    const result = await request({
      uri: "http://localhost:3011/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createEditorAuthToken() },
      body: {
        query: "{ tags { geo { tagType, id , label } } }"
      },
      timeout: 30000
    });

    expect(result).toEqual({
      data: {
        tags: {
          geo: [
            {
              tagType: tagType.GEO,
              id: "geo/usa",
              label: "usa"
            }
          ]
        }
      }
    });
  });
});
