import { sync } from "jest-toolkit";
import request from "request-promise-native";
import delay from "delay";
import * as testData from "../utils/test-data";
import * as dynamodb from "../utils/dynamodb";
import * as cognitoAuth from "../utils/cognito-auth";
import * as lambdaUtils from "../utils/lambda";
import SnsListener from "../utils/serverless-offline-sns-listener";
import * as entityType from "../../src/types/entity-type";
import * as eventSeriesType from "../../src/types/event-series-type";
import * as statusType from "../../src/types/status-type";
jest.setTimeout(30000);

describe("event series", () => {
  let testEventSeriesId = null;
  let snsListener = null;
  const testEventSeriesBody = testData.createNewEventSeriesBody();

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

  it("should fail to create an invalid event series", async () => {
    expect(
      await sync(
        request({
          uri: "http://localhost:3014/admin/event-series",
          json: true,
          method: "POST",
          headers: { Authorization: cognitoAuth.EDITOR_AUTH_TOKEN },
          body: { status: statusType.ACTIVE },
          timeout: 14000
        })
      )
    ).toThrow(/Name can't be blank/);
  });

  it("should fail to create an event series when the user is the readonly user", async () => {
    expect(
      await sync(
        request({
          uri: "http://localhost:3014/admin/event-series",
          json: true,
          method: "POST",
          headers: { Authorization: cognitoAuth.READONLY_AUTH_TOKEN },
          body: testEventSeriesBody,
          timeout: 14000
        })
      )
    ).toThrow(/readonly user cannot modify system/);
  });

  it("should create a valid event series", async () => {
    snsListener.clearReceivedMessages();
    const response = await request({
      uri: "http://localhost:3014/admin/event-series",
      json: true,
      method: "POST",
      headers: { Authorization: cognitoAuth.EDITOR_AUTH_TOKEN },
      body: testEventSeriesBody,
      timeout: 14000
    });

    const parsedResponse = lambdaUtils.parseLambdaResponse(response);
    expect(parsedResponse.entity).toEqual(
      expect.objectContaining({
        eventSeriesType: eventSeriesType.OCCASIONAL,
        summary: "Stand-up poetry",
        status: statusType.ACTIVE,
        version: 1
      })
    );

    testEventSeriesId = parsedResponse.entity.id;

    delay(3000);
    expect(snsListener.receivedMessages).toEqual([
      {
        entityType: entityType.EVENT_SERIES,
        entity: expect.objectContaining({
          eventSeriesType: eventSeriesType.OCCASIONAL,
          summary: "Stand-up poetry",
          status: statusType.ACTIVE,
          version: 1
        })
      }
    ]);
  });

  it("should get the event series without cache control headers when using the admin api", async () => {
    const response = await request({
      uri: "http://localhost:3014/admin/event-series/" + testEventSeriesId,
      json: true,
      method: "GET",
      timeout: 14000,
      resolveWithFullResponse: true
    });

    const parsedResponse = lambdaUtils.parseLambdaResponse(response.body);
    expect(parsedResponse.entity).toEqual(
      expect.objectContaining({
        id: testEventSeriesId,
        eventSeriesType: eventSeriesType.OCCASIONAL,
        summary: "Stand-up poetry",
        status: statusType.ACTIVE,
        version: 1
      })
    );
  });

  it("should get the event series with cache control headers when using the public api", async () => {
    const response = await request({
      uri: "http://localhost:3014/public/event-series/" + testEventSeriesId,
      json: true,
      method: "GET",
      timeout: 14000,
      resolveWithFullResponse: true
    });

    const parsedResponse = lambdaUtils.parseLambdaResponse(response.body);
    expect(parsedResponse.entity).toEqual(
      expect.objectContaining({
        id: testEventSeriesId,
        eventSeriesType: eventSeriesType.OCCASIONAL,
        summary: "Stand-up poetry",
        entityType: entityType.EVENT_SERIES,
        status: statusType.ACTIVE,
        isFullEntity: true
      })
    );
  });

  it("should get the event series using the get multi endpoint", async () => {
    const response = await request({
      uri:
        "http://localhost:3014/public/event-series?ids=" +
        encodeURIComponent(testEventSeriesId),
      json: true,
      method: "GET",
      timeout: 14000
    });

    const parsedResponse = lambdaUtils.parseLambdaResponse(response);
    expect(parsedResponse.entities.length).toEqual(1);
    expect(parsedResponse.entities[0]).toEqual(
      expect.objectContaining({
        id: testEventSeriesId,
        eventSeriesType: eventSeriesType.OCCASIONAL,
        summary: "Stand-up poetry",
        entityType: entityType.EVENT_SERIES,
        status: statusType.ACTIVE
      })
    );
  });

  it("should reject a stale update to the event series", async () => {
    expect(
      await sync(
        request({
          uri: "http://localhost:3014/admin/event-series/" + testEventSeriesId,
          json: true,
          method: "PUT",
          headers: { Authorization: cognitoAuth.EDITOR_AUTH_TOKEN },
          body: testEventSeriesBody,
          timeout: 14000
        })
      )
    ).toThrow(/Stale Data/);
  });

  it("should accept a valid update to the event series", async () => {
    snsListener.clearReceivedMessages();
    const response = await request({
      uri: "http://localhost:3014/admin/event-series/" + testEventSeriesId,
      json: true,
      method: "PUT",
      headers: { Authorization: cognitoAuth.EDITOR_AUTH_TOKEN },
      body: {
        ...testEventSeriesBody,
        summary: "Stand-up poetry New",
        version: 2
      },
      timeout: 14000
    });

    const parsedResponse = lambdaUtils.parseLambdaResponse(response);
    expect(parsedResponse.entity).toEqual(
      expect.objectContaining({
        id: testEventSeriesId,
        summary: "Stand-up poetry New",
        status: statusType.ACTIVE,
        version: 2
      })
    );

    delay(3000);
    expect(snsListener.receivedMessages).toEqual([
      {
        entityType: entityType.EVENT_SERIES,
        entity: expect.objectContaining({
          eventSeriesType: eventSeriesType.OCCASIONAL,
          summary: "Stand-up poetry New",
          status: statusType.ACTIVE,
          version: 2
        })
      }
    ]);
  });

  it("should fail to get a non-existent event series", async () => {
    expect(
      await sync(
        request({
          uri: "http://localhost:3014/public/event-series/does-not-exist",
          json: true,
          method: "GET",
          timeout: 14000,
          resolveWithFullResponse: true
        })
      )
    ).toThrow(/Entity Not Found/);
  });
});
