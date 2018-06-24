import request from "request-promise-native";
import delay from "delay";
import * as testData from "../utils/test-data";
import * as dynamodb from "../utils/dynamodb";
import * as cognitoAuth from "../utils/cognito-auth";
import SnsListener from "../utils/serverless-offline-sns-listener";
jest.setTimeout(30000);

describe("venue iteration", () => {
  let snsListener = null;
  const testVenueBody = testData.createNewVenueBody();

  beforeAll(async () => {
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
      uri: "http://localhost:3014/admin/venue",
      json: true,
      method: "POST",
      headers: { Authorization: cognitoAuth.EDITOR_AUTH_TOKEN },
      body: testVenueBody,
      timeout: 14000
    });

    // allow index sns message to be produced.
    await delay(3000);
  });

  afterAll(async () => {
    await snsListener.stopListening();
  });

  it("should iterate the venues to index them", async () => {
    snsListener.clearReceivedMessages();
    await request({
      uri: "http://localhost:3014/admin/search/refresh/venue",
      json: true,
      method: "POST",
      headers: { Authorization: cognitoAuth.EDITOR_AUTH_TOKEN },
      body: { status: "Active" },
      timeout: 14000
    });

    await delay(5000);
    expect(snsListener.receivedMessages).toEqual([
      {
        entityType: "venue",
        entity: expect.objectContaining({
          status: "Active",
          postcode: "N1 1TA",
          version: 1
        })
      }
    ]);

    const response = await dynamodb.getAllIterationLogs(
      "artfullylondon-development-event-iteration-log"
    );
    expect(response).toEqual([
      expect.objectContaining({
        actionId: "venue refresh",
        completed: true,
        errors: []
      })
    ]);
  });
});
