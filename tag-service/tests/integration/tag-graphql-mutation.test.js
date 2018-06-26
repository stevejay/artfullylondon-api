import request from "request-promise-native";
// import { sync } from "jest-toolkit";
import { EDITOR_AUTH_TOKEN } from "../utils/cognito-auth";
import { addToTable, truncateTagTable } from "../utils/dynamodb";
jest.setTimeout(60000);

describe("tag graphql querying", () => {
  beforeAll(async () => {
    await truncateTagTable("artfullylondon-development-tag");
    // await addToTable("artfullylondon-development-tag", {
    //   tagType: "audience",
    //   id: "audience/families",
    //   label: "families"
    // });
    // await addToTable("artfullylondon-development-tag", {
    //   tagType: "geo",
    //   id: "geo/usa",
    //   label: "usa"
    // });
  });

  it("should support adding a tag", async () => {
    const result = await request({
      uri: "http://localhost:3011/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: EDITOR_AUTH_TOKEN },
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

  it("should support deleting a tag", async () => {
    const result = await request({
      uri: "http://localhost:3011/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: EDITOR_AUTH_TOKEN },
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

  // it("should support querying of tags by tag type", async () => {
  //   const result = await request({
  //     uri: "http://localhost:3011/graphql",
  //     json: true,
  //     method: "POST",
  //     headers: { Authorization: EDITOR_AUTH_TOKEN },
  //     body: {
  //       query: "{ tags { geo { tagType, id , label } } }"
  //     },
  //     timeout: 30000
  //   });

  //   expect(result).toEqual({
  //     data: {
  //       tags: {
  //         geo: [
  //           {
  //             tagType: "geo",
  //             id: "geo/usa",
  //             label: "usa"
  //           }
  //         ]
  //       }
  //     }
  //   });
  // });
});
