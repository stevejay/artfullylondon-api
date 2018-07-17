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

  it("should support querying of tags by tag type", async () => {
    const result = await request({
      uri: "http://localhost:3011/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createEditorAuthToken() },
      body: {
        query: "{ tags(tagType: GEO) { nodes { tagType, id , label } } }"
      },
      timeout: 30000
    });

    expect(result).toEqual({
      data: {
        tags: {
          nodes: [
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
