import request from "request-promise-native";
import { sync } from "jest-toolkit";
import uuidv4 from "uuid/v4";
import delay from "delay";
import { EDITOR_AUTH_TOKEN } from "../utils/cognito-auth";
import * as dynamodbUtils from "../utils/dynamodb";
import * as s3Utils from "../utils/s3";
import * as lambdaUtils from "../utils/lambda";
jest.setTimeout(60000);

const ORIGINAL_BUCKET_NAME = "artfullylondon-development-original-images";
const RESIZED_BUCKET_NAME = "artfullylondon-development-resized-images";
const ITERATION_LOG_TABLE_NAME =
  "artfullylondon-development-image-iteration-log";
const IMAGE_TABLE_NAME = "artfullylondon-development-image";

describe("image handling", () => {
  beforeAll(async () => {
    await dynamodbUtils.truncateIterationLogTable(ITERATION_LOG_TABLE_NAME);
    await dynamodbUtils.truncateTable(IMAGE_TABLE_NAME);
    await s3Utils.createBucket(ORIGINAL_BUCKET_NAME);
    await s3Utils.createBucket(RESIZED_BUCKET_NAME);
  });

  afterAll(async () => {
    await s3Utils.deleteBucket(ORIGINAL_BUCKET_NAME);
    await s3Utils.deleteBucket(RESIZED_BUCKET_NAME);
  });

  it("should reject getting metadata for a non-existent image", async () => {
    expect(
      await sync(
        request({
          uri: "http://localhost:3016/image/aa111111222222223333333344444444",
          json: true,
          method: "GET",
          timeout: 30000
        })
      )
    ).toThrow(/Entity Not Found/);
  });

  it("should add an image", async () => {
    const imageId = uuidv4().replace(/-/g, "");
    const sourceUrl =
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Shakespeare.jpg/599px-Shakespeare.jpg";
    const expectedImageData = {
      imageType: "talent",
      id: imageId,
      mimeType: "image/jpeg",
      sourceUrl,
      width: 599,
      height: 767,
      dominantColor: "393127",
      resizeVersion: 5
    };

    let response = await request({
      uri: `http://localhost:3016/image/${imageId}`,
      json: true,
      method: "PUT",
      headers: { Authorization: EDITOR_AUTH_TOKEN },
      body: {
        type: "talent",
        url: sourceUrl
      },
      timeout: 30000
    });

    let parsedResponse = lambdaUtils.parseLambdaResponse(response);
    expect(parsedResponse.image).toEqual(
      expect.objectContaining(expectedImageData)
    );
    expect(parsedResponse.image.ratio).toBeCloseTo(1.28, 1);
    expect(parsedResponse.image.modifiedDate).toBeDefined();

    response = await request({
      uri: `http://localhost:3016/image/${imageId}`,
      json: true,
      method: "GET",
      timeout: 30000
    });

    parsedResponse = lambdaUtils.parseLambdaResponse(response);
    expect(parsedResponse.image).toEqual(
      expect.objectContaining(expectedImageData)
    );

    await request({
      uri: "http://localhost:3016/images/reprocess",
      json: true,
      method: "POST",
      headers: { Authorization: EDITOR_AUTH_TOKEN },
      timeout: 30000
    });

    await delay(8000);
    const logs = await dynamodbUtils.getAllIterationLogs(
      ITERATION_LOG_TABLE_NAME
    );

    expect(logs.length).toEqual(1);
    expect(logs[0]).toEqual(
      expect.objectContaining({
        actionId: "IterateImages",
        completed: true,
        errors: []
      })
    );
  });
});
