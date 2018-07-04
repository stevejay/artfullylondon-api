import request from "request-promise-native";
import uuidv4 from "uuid/v4";
import * as authUtils from "../utils/auth";
import * as emailFrequencyType from "../../src/email-frequency-type";
import * as entityType from "../../src/entity-type";
import * as watchChangeType from "../../src/watch-change-type";
jest.setTimeout(60000);

const USER_QUERY = `
{
  preferences {
    emailFrequency
  }
  watches {
    tag { items { id, label }, version }
    event { items { id, label }, version }
    eventSeries { items { id, label }, version }
    talent { items { id, label }, version }
    venue { items { id, label }, version }
  }
}
`;

const DELETE_USER_MUTATION = `
mutation DeleteUser {
  deleteUser {
    ok
  }
}
`;

describe("user", () => {
  const userId = uuidv4();

  it("should get a user", async () => {
    const response = await request({
      uri: "http://localhost:3012/graphql",
      json: true,
      method: "POST",
      headers: {
        Authorization: authUtils.createAuthorizationHeaderValue(userId)
      },
      body: { query: USER_QUERY },
      timeout: 30000
    });

    expect(response).toEqual({
      data: {
        preferences: {
          emailFrequency: emailFrequencyType.DAILY
        },
        watches: {
          event: { items: [], version: 0 },
          eventSeries: { items: [], version: 0 },
          talent: { items: [], version: 0 },
          venue: { items: [], version: 0 },
          tag: { items: [], version: 0 }
        }
      }
    });
  });

  it("should delete a user", async () => {
    const response = await request({
      uri: "http://localhost:3012/graphql",
      json: true,
      method: "POST",
      headers: {
        Authorization: authUtils.createAuthorizationHeaderValue(userId)
      },
      body: { query: DELETE_USER_MUTATION },
      timeout: 30000
    });

    expect(response).toEqual({
      data: {
        deleteUser: {
          ok: true
        }
      }
    });
  });
});
