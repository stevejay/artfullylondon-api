"use strict";

const dynamodb = require("../external-services/dynamodb");
const iterationLockRepository = require("./iteration-lock-repository");

process.env.SERVERLESS_ITERATON_LOCK_TABLE_NAME = "IterationLock";

describe("iteration-lock-repository", () => {
  describe("deleteLock", () => {
    it("should delete a lock", async () => {
      dynamodb.delete = jest.fn().mockResolvedValue();

      await iterationLockRepository.deleteLock("some-action-id");

      expect(dynamodb.delete).toHaveBeenCalledWith({
        TableName: process.env.SERVERLESS_ITERATON_LOCK_TABLE_NAME,
        Key: { actionId: "some-action-id" },
        ReturnConsumedCapacity: undefined
      });
    });
  });

  describe("addLock", () => {
    it("should add a lock", async () => {
      dynamodb.put = jest.fn().mockResolvedValue();

      await iterationLockRepository.addLock({ actionId: "some-action-id" });

      expect(dynamodb.put).toHaveBeenCalledWith({
        TableName: process.env.SERVERLESS_ITERATON_LOCK_TABLE_NAME,
        Item: { actionId: "some-action-id" },
        ConditionExpression: "attribute_not_exists(actionId)",
        ReturnConsumedCapacity: undefined
      });
    });
  });
});
