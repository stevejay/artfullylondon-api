"use strict";

const dynamodb = require("../external-services/dynamodb");
const iterationRepository = require("./iteration-repository");

process.env.SERVERLESS_ITERATON_TABLE_NAME = "Iteration";

describe("iteration-repository", () => {
  describe("setIterationEndTimestamp", () => {
    it("should set an iteration end timestamp", async () => {
      dynamodb.update = jest.fn().mockResolvedValue();

      await iterationRepository.setIterationEndTimestamp(
        "some-action-id",
        12345678
      );

      expect(dynamodb.update).toHaveBeenCalledWith(
        expect.objectContaining({
          TableName: process.env.SERVERLESS_ITERATON_TABLE_NAME,
          Key: { actionId: "some-action-id", startTimestamp: 12345678 },
          UpdateExpression: "set endTimestamp = :endTimestamp",
          ReturnConsumedCapacity: undefined
        })
      );
    });
  });

  describe("addIteration", () => {
    it("should add an iteration", async () => {
      dynamodb.put = jest.fn().mockResolvedValue();

      await iterationRepository.addIteration({ id: "some-id" });

      expect(dynamodb.put).toHaveBeenCalledWith({
        TableName: process.env.SERVERLESS_ITERATON_TABLE_NAME,
        Item: { id: "some-id" },
        ReturnConsumedCapacity: undefined
      });
    });
  });

  describe("getMostRecentIteration", () => {
    it("should get the most recent iteration", async () => {
      dynamodb.queryBasic = jest
        .fn()
        .mockResolvedValue({ Items: [{ id: "some-id" }] });

      const response = await iterationRepository.getMostRecentIteration(
        "some-action-id"
      );

      expect(response).toEqual({ Items: [{ id: "some-id" }] });

      expect(dynamodb.queryBasic).toHaveBeenCalledWith({
        TableName: process.env.SERVERLESS_ITERATON_TABLE_NAME,
        KeyConditionExpression: "actionId = :actionId",
        ExpressionAttributeValues: { ":actionId": "some-action-id" },
        Limit: 1,
        ScanIndexForward: false,
        ProjectionExpression: "startTimestamp",
        ReturnConsumedCapacity: undefined
      });
    });
  });
});
