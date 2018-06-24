import { sync } from "jest-toolkit";
import request from "request-promise-native";
import delay from "delay";
import * as testData from "../utils/test-data";
import * as dynamodb from "../utils/dynamodb";
import * as cognitoAuth from "../utils/cognito-auth";
import * as lambdaUtils from "../utils/lambda";
import SnsListener from "../utils/serverless-offline-sns-listener";
jest.setTimeout(30000);

describe("venue", () => {
  let testVenueId = null;
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
  });

  afterAll(async () => {
    await snsListener.stopListening();
  });

  it("should fail to create an invalid venue", async () => {
    expect(
      await sync(
        request({
          uri: "http://localhost:3014/admin/venue",
          json: true,
          method: "POST",
          headers: { Authorization: cognitoAuth.EDITOR_AUTH_TOKEN },
          body: { status: "Active" },
          timeout: 14000
        })
      )
    ).toThrow(/Name can't be blank/);
  });

  it("should fail to create a venue when the user is the readonly user", async () => {
    expect(
      await sync(
        request({
          uri: "http://localhost:3014/admin/venue",
          json: true,
          method: "POST",
          headers: { Authorization: cognitoAuth.READONLY_AUTH_TOKEN },
          body: testVenueBody,
          timeout: 14000
        })
      )
    ).toThrow(/readonly user cannot modify system/);
  });

  it("should create a valid venue", async () => {
    snsListener.clearReceivedMessages();
    const response = await request({
      uri: "http://localhost:3014/admin/venue",
      json: true,
      method: "POST",
      headers: { Authorization: cognitoAuth.EDITOR_AUTH_TOKEN },
      body: testVenueBody,
      timeout: 14000
    });

    const parsedResponse = lambdaUtils.parseLambdaResponse(response);
    expect(parsedResponse.entity).toEqual(
      expect.objectContaining({
        status: "Active",
        postcode: "N1 1TA",
        version: 1
      })
    );

    testVenueId = parsedResponse.entity.id;

    delay(3000);
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
  });

  it("should get the venue without cache control headers when using the admin api", async () => {
    const response = await request({
      uri: "http://localhost:3014/admin/venue/" + testVenueId,
      json: true,
      method: "GET",
      timeout: 14000,
      resolveWithFullResponse: true
    });

    const parsedResponse = lambdaUtils.parseLambdaResponse(response.body);
    expect(parsedResponse.entity).toEqual(
      expect.objectContaining({
        id: testVenueId,
        postcode: "N1 1TA",
        status: "Active",
        version: 1
      })
    );
  });

  it("should get the venue with cache control headers when using the public api", async () => {
    const response = await request({
      uri: "http://localhost:3014/public/venue/" + testVenueId,
      json: true,
      method: "GET",
      timeout: 14000,
      resolveWithFullResponse: true
    });

    const parsedResponse = lambdaUtils.parseLambdaResponse(response.body);
    expect(parsedResponse.entity).toEqual(
      expect.objectContaining({
        id: testVenueId,
        postcode: "N1 1TA",
        entityType: "venue",
        status: "Active",
        isFullEntity: true
      })
    );
  });

  it("should get the venue using the get multi endpoint", async () => {
    const response = await request({
      uri:
        "http://localhost:3014/public/venue?ids=" +
        encodeURIComponent(testVenueId),
      json: true,
      method: "GET",
      timeout: 14000
    });

    const parsedResponse = lambdaUtils.parseLambdaResponse(response);
    expect(parsedResponse.entities.length).toEqual(1);
    expect(parsedResponse.entities[0]).toEqual(
      expect.objectContaining({
        id: testVenueId,
        postcode: "N1 1TA",
        entityType: "venue",
        status: "Active"
      })
    );
  });

  it("should reject a stale update to the venue", async () => {
    expect(
      await sync(
        request({
          uri: "http://localhost:3014/admin/venue/" + testVenueId,
          json: true,
          method: "PUT",
          headers: { Authorization: cognitoAuth.EDITOR_AUTH_TOKEN },
          body: testVenueBody,
          timeout: 14000
        })
      )
    ).toThrow(/Stale Data/);
  });

  it("should accept a valid update to the venue", async () => {
    snsListener.clearReceivedMessages();
    const response = await request({
      uri: "http://localhost:3014/admin/venue/" + testVenueId,
      json: true,
      method: "PUT",
      headers: { Authorization: cognitoAuth.EDITOR_AUTH_TOKEN },
      body: {
        ...testVenueBody,
        postcode: "N8 0KL",
        version: 2
      },
      timeout: 14000
    });

    const parsedResponse = lambdaUtils.parseLambdaResponse(response);
    expect(parsedResponse.entity).toEqual(
      expect.objectContaining({
        id: testVenueId,
        postcode: "N8 0KL",
        status: "Active",
        version: 2
      })
    );

    delay(3000);
    expect(snsListener.receivedMessages).toEqual([
      {
        entityType: "venue",
        entity: expect.objectContaining({
          postcode: "N8 0KL",
          status: "Active",
          version: 2
        })
      }
    ]);
  });

  it("should fail to get a non-existent venue", async () => {
    expect(
      await sync(
        request({
          uri: "http://localhost:3014/public/venue/does-not-exist",
          json: true,
          method: "GET",
          timeout: 14000,
          resolveWithFullResponse: true
        })
      )
    ).toThrow(/Entity Not Found/);
  });
});
