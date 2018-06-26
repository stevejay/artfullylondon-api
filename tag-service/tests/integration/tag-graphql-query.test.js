import request from "request-promise-native";
import { EDITOR_AUTH_TOKEN } from "../utils/cognito-auth";
import { addToTable, truncateTagTable } from "../utils/dynamodb";
jest.setTimeout(60000);

describe("tag graphql querying", () => {
  beforeAll(async () => {
    await truncateTagTable("artfullylondon-development-tag");
    await addToTable("artfullylondon-development-tag", {
      tagType: "audience",
      id: "audience/families",
      label: "families"
    });
    await addToTable("artfullylondon-development-tag", {
      tagType: "geo",
      id: "geo/usa",
      label: "usa"
    });
  });

  it("should support querying of all tags", async () => {
    const result = await request({
      uri: "http://localhost:3011/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: EDITOR_AUTH_TOKEN },
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
      headers: { Authorization: EDITOR_AUTH_TOKEN },
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
              tagType: "geo",
              id: "geo/usa",
              label: "usa"
            }
          ]
        }
      }
    });
  });
});
