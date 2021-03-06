import request from "request-promise-native";
import uuidv4 from "uuid/v4";
import * as watchType from "../../src/watch-type";
import * as watchChangeType from "../../src/watch-change-type";
import * as authUtils from "../utils/authentication";
import MockJwksServer from "../utils/mock-jwks-server";
jest.setTimeout(60000);

const EVENT_WATCHES_QUERY = `
{
  watches {
    event { items { id, label }, version }
  }
}
`;

const UPDATE_WATCHES_MUTATION = `
mutation UpdateWatches(
  $watchType: WatchTypeEnum!,
  $newVersion: Int!,
  $changes: [WatchChangeInput!]!
) {
  updateWatches(
    input: { watchType: $watchType, newVersion: $newVersion, changes: $changes }
  ) {
    watches {
      items { id, label },
      version
    }
  }
}
`;

describe("watches", () => {
  const userId = uuidv4();
  const mockJwksServer = new MockJwksServer();

  beforeAll(async () => {
    mockJwksServer.start(3021);
  });

  afterAll(async () => {
    mockJwksServer.stop();
  });

  it("should update event watches", async () => {
    const response = await request({
      uri: "http://localhost:3012/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createAuthToken(userId) },
      body: {
        query: UPDATE_WATCHES_MUTATION,
        variables: {
          watchType: watchType.EVENT,
          newVersion: 1,
          changes: [
            {
              changeType: watchChangeType.ADD,
              id: "1111",
              label: "Label 1111"
            },
            {
              changeType: watchChangeType.ADD,
              id: "2222",
              label: "Label 2222"
            }
          ]
        }
      },
      timeout: 30000
    });

    expect(response).toEqual({
      data: {
        updateWatches: {
          watches: {
            version: 1,
            items: [
              {
                id: "1111",
                label: "Label 1111"
              },
              {
                id: "2222",
                label: "Label 2222"
              }
            ]
          }
        }
      }
    });
  });

  it("should get the event watches", async () => {
    const response = await request({
      uri: "http://localhost:3012/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createAuthToken(userId) },
      body: { query: EVENT_WATCHES_QUERY },
      timeout: 30000
    });

    expect(response).toEqual({
      data: {
        watches: {
          event: {
            version: 1,
            items: [
              {
                id: "1111",
                label: "Label 1111"
              },
              {
                id: "2222",
                label: "Label 2222"
              }
            ]
          }
        }
      }
    });
  });

  it("should delete an event watch", async () => {
    let response = await request({
      uri: "http://localhost:3012/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createAuthToken(userId) },
      body: {
        query: UPDATE_WATCHES_MUTATION,
        variables: {
          watchType: watchType.EVENT,
          newVersion: 2,
          changes: [
            {
              changeType: watchChangeType.DELETE,
              id: "1111"
            }
          ]
        }
      },
      timeout: 30000
    });

    expect(response).toEqual({
      data: {
        updateWatches: {
          watches: {
            version: 2,
            items: [
              {
                id: "2222",
                label: "Label 2222"
              }
            ]
          }
        }
      }
    });

    response = await request({
      uri: "http://localhost:3012/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createAuthToken(userId) },
      body: { query: EVENT_WATCHES_QUERY },
      timeout: 30000
    });

    expect(response).toEqual({
      data: {
        watches: {
          event: {
            version: 2,
            items: [
              {
                id: "2222",
                label: "Label 2222"
              }
            ]
          }
        }
      }
    });
  });
});
