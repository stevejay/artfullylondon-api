import request from "request-promise-native";
import uuidv4 from "uuid/v4";
import * as emailFrequencyType from "../../src/email-frequency-type";
import * as authUtils from "../utils/authentication";
import MockJwksServer from "../utils/mock-jwks-server";
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
  const mockJwksServer = new MockJwksServer();

  beforeAll(async () => {
    mockJwksServer.start(3021);
  });

  afterAll(async () => {
    mockJwksServer.stop();
  });

  it("should get a user", async () => {
    const response = await request({
      uri: "http://localhost:3012/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createAuthToken(userId) },
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
      headers: { Authorization: authUtils.createAuthToken(userId) },
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
