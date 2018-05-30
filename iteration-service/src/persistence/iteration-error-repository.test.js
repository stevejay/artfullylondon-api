"use strict";

const dynamodb = require("../external-services/dynamodb");
const iterationErrorRepository = require("./iteration-error-repository");

process.env.SERVERLESS_ITERATON_ERROR_TABLE_NAME = "IterationError";

describe("iteration-error-repository", () => {
  describe("saveError", () => {
    it("should save an error", async () => {
      dynamodb.put = jest.fn().mockResolvedValue();

      await iterationErrorRepository.saveError({ error: "Some error" });

      expect(dynamodb.put).toHaveBeenCalledWith({
        TableName: process.env.SERVERLESS_ITERATON_ERROR_TABLE_NAME,
        Item: { error: "Some error" },
        ReturnConsumedCapacity: undefined
      });
    });
  });

  describe("getErrorsForIteration", () => {
    it("should get iteration errors", async () => {
      dynamodb.query = jest.fn().mockResolvedValue([{ id: "some-id" }]);

      const response = await iterationErrorRepository.getErrorsForIteration(
        "some-key"
      );

      expect(response).toEqual([{ id: "some-id" }]);

      expect(dynamodb.query).toHaveBeenCalledWith({
        TableName: process.env.SERVERLESS_ITERATON_ERROR_TABLE_NAME,
        KeyConditionExpression:
          "actionIdStartTimestamp = :actionIdStartTimestamp",
        ExpressionAttributeValues: {
          ":actionIdStartTimestamp": "some-key"
        },
        ProjectionExpression: "entityId, message",
        ReturnConsumedCapacity: undefined
      });
    });
  });
});
