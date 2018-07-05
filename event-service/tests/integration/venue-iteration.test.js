import request from "request-promise-native";
import delay from "delay";
import * as testData from "../utils/test-data";
import * as dynamodb from "../utils/dynamodb";
import SnsListener from "../utils/serverless-offline-sns-listener";
import * as entityType from "../../src/types/entity-type";
import * as statusType from "../../src/types/status-type";
import MockJwksServer from "../utils/mock-jwks-server";
import * as authUtils from "../utils/authentication";
import {
  CREATE_VENUE_MUTATION,
  REFRESH_SEARCH_INDEX_MUTATION
} from "./queries";
jest.setTimeout(30000);

describe("venue iteration", () => {
  const mockJwksServer = new MockJwksServer();
  let snsListener = null;
  const testVenueBody = testData.createNewVenueBody();

  beforeAll(async () => {
    mockJwksServer.start(3021);
    await dynamodb.truncateAllTables();

    snsListener = new SnsListener({
      endpoint: "http://127.0.0.1:4002",
      region: "eu-west-1"
    });
    await snsListener.startListening(
      "arn:aws:sns:eu-west-1:1111111111111:IndexDocument-development",
      3019
    );

    await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createEditorAuthToken() },
      body: {
        query: CREATE_VENUE_MUTATION,
        variables: testVenueBody
      },
      timeout: 14000
    });

    // allow index sns message to be produced.
    await delay(3000);
  });

  afterAll(async () => {
    mockJwksServer.stop();
    await snsListener.stopListening();
  });

  it("should iterate the venues to index them", async () => {
    snsListener.clearReceivedMessages();
    let response = await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createEditorAuthToken() },
      body: {
        query: REFRESH_SEARCH_INDEX_MUTATION,
        variables: { entityType: entityType.VENUE }
      },
      timeout: 14000
    });

    expect(response).toEqual({
      data: {
        refreshSearchIndex: { ok: true }
      }
    });

    await delay(3000);
    expect(snsListener.receivedMessages).toEqual([
      {
        entityType: entityType.VENUE,
        entity: expect.objectContaining({
          status: statusType.ACTIVE,
          postcode: "N1 1TA",
          version: 1
        })
      }
    ]);

    response = await dynamodb.getAllIterationLogs(
      "artfullylondon-development-event-iteration-log"
    );
    expect(response).toEqual([
      expect.objectContaining({
        actionId: `${entityType.VENUE} refresh`,
        completed: true,
        errors: []
      })
    ]);
  });
});
