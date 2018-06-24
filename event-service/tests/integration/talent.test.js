import { sync } from "jest-toolkit";
import request from "request-promise-native";
import delay from "delay";
import * as testData from "../utils/test-data";
import * as dynamodb from "../utils/dynamodb";
import * as cognitoAuth from "../utils/cognito-auth";
import * as lambdaUtils from "../utils/lambda";
import * as redisUtils from "../utils/redis";
import SnsListener from "../utils/serverless-offline-sns-listener";
jest.setTimeout(30000);

describe("talent", () => {
  let testTalentId = null;
  let snsListener = null;
  const testTalentBody = testData.createNewTalentBody();

  beforeAll(async () => {
    await dynamodb.truncateAllTables();
    await redisUtils.flushAll();
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

  it("should fail to create an invalid talent", async () => {
    expect(
      await sync(
        request({
          uri: "http://localhost:3014/admin/talent",
          json: true,
          method: "POST",
          headers: { Authorization: cognitoAuth.EDITOR_AUTH_TOKEN },
          body: { status: "Active" },
          timeout: 14000
        })
      )
    ).toThrow(/Last Name can't be blank/);
  });

  it("should fail to create a talent when the user is the readonly user", async () => {
    expect(
      await sync(
        request({
          uri: "http://localhost:3014/admin/talent",
          json: true,
          method: "POST",
          headers: { Authorization: cognitoAuth.READONLY_AUTH_TOKEN },
          body: testTalentBody,
          timeout: 14000
        })
      )
    ).toThrow(/readonly user cannot modify system/);
  });

  it("should create a valid talent", async () => {
    snsListener.clearReceivedMessages();
    const response = await request({
      uri: "http://localhost:3014/admin/talent",
      json: true,
      method: "POST",
      headers: { Authorization: cognitoAuth.EDITOR_AUTH_TOKEN },
      body: testTalentBody,
      timeout: 14000
    });

    const parsedResponse = lambdaUtils.parseLambdaResponse(response);
    expect(parsedResponse.entity).toEqual(
      expect.objectContaining({
        commonRole: "Poet",
        firstNames: "Byron",
        links: [{ type: "Homepage", url: "http://www.byronvincent.com/" }],
        status: "Active",
        talentType: "Individual",
        version: 1
      })
    );

    testTalentId = parsedResponse.entity.id;

    delay(3000);
    expect(snsListener.receivedMessages).toEqual([
      {
        entityType: "talent",
        entity: expect.objectContaining({
          commonRole: "Poet",
          firstNames: "Byron",
          links: [{ type: "Homepage", url: "http://www.byronvincent.com/" }],
          status: "Active",
          talentType: "Individual",
          version: 1
        })
      }
    ]);
  });

  it("should get the talent without cache control headers when using the admin api", async () => {
    const response = await request({
      uri: "http://localhost:3014/admin/talent/" + testTalentId,
      json: true,
      method: "GET",
      timeout: 14000,
      resolveWithFullResponse: true
    });

    // expect(response.headers).toEqual(
    //   expect.objectContaining({
    //     "cache-control": "no-cache"
    //   })
    // );

    // expect(response.headers.etag).not.toBeDefined();

    const parsedResponse = lambdaUtils.parseLambdaResponse(response.body);
    expect(parsedResponse.entity).toEqual(
      expect.objectContaining({
        id: testTalentId,
        firstNames: "Byron",
        status: "Active",
        version: 1
      })
    );
  });

  it("should get the talent with cache control headers when using the public api", async () => {
    const response = await request({
      uri: "http://localhost:3014/public/talent/" + testTalentId,
      json: true,
      method: "GET",
      timeout: 14000,
      resolveWithFullResponse: true
    });

    // expect(response.headers).toEqual(
    //   expect.objectContaining({
    //     "x-artfully-cache": "Miss",
    //     "cache-control": "public, max-age=1800"
    //   })
    // );

    // expect(response.headers.etag).toBeDefined();

    const parsedResponse = lambdaUtils.parseLambdaResponse(response.body);
    expect(parsedResponse.entity).toEqual(
      expect.objectContaining({
        id: testTalentId,
        commonRole: "Poet",
        firstNames: "Byron",
        status: "Active",
        talentType: "Individual",
        entityType: "talent",
        isFullEntity: true
      })
    );
  });

  it("should get the talent using the get multi endpoint", async () => {
    const response = await request({
      uri:
        "http://localhost:3014/public/talent?ids=" +
        encodeURIComponent(testTalentId),
      json: true,
      method: "GET",
      timeout: 14000
    });

    const parsedResponse = lambdaUtils.parseLambdaResponse(response);
    expect(parsedResponse.entities.length).toEqual(1);
    expect(parsedResponse.entities[0]).toEqual(
      expect.objectContaining({
        id: testTalentId,
        commonRole: "Poet",
        firstNames: "Byron",
        status: "Active",
        talentType: "Individual",
        entityType: "talent"
      })
    );
  });

  it("should reject a stale update to the talent", async () => {
    expect(
      await sync(
        request({
          uri: "http://localhost:3014/admin/talent/" + testTalentId,
          json: true,
          method: "PUT",
          headers: { Authorization: cognitoAuth.EDITOR_AUTH_TOKEN },
          body: testTalentBody,
          timeout: 14000
        })
      )
    ).toThrow(/Stale Data/);
  });

  it("should accept a valid update to the talent", async () => {
    snsListener.clearReceivedMessages();
    const response = await request({
      uri: "http://localhost:3014/admin/talent/" + testTalentId,
      json: true,
      method: "PUT",
      headers: { Authorization: cognitoAuth.EDITOR_AUTH_TOKEN },
      body: {
        ...testTalentBody,
        firstNames: "Byron New",
        version: 2
      },
      timeout: 14000
    });

    const parsedResponse = lambdaUtils.parseLambdaResponse(response);
    expect(parsedResponse.entity).toEqual(
      expect.objectContaining({
        id: testTalentId,
        firstNames: "Byron New",
        status: "Active",
        version: 2
      })
    );

    delay(3000);
    expect(snsListener.receivedMessages).toEqual([
      {
        entityType: "talent",
        entity: expect.objectContaining({
          id: testTalentId,
          firstNames: "Byron New",
          status: "Active",
          version: 2
        })
      }
    ]);
  });

  it("should fail to get a non-existent talent", async () => {
    expect(
      await sync(
        request({
          uri: "http://localhost:3014/public/talent/does-not-exist",
          json: true,
          method: "GET",
          timeout: 14000,
          resolveWithFullResponse: true
        })
      )
    ).toThrow(/Entity Not Found/);
  });
});
