"use strict";

const dynamodb = require("../external-services/dynamodb");
const entityLib = require("./entity");

describe("entity", () => {
  describe("isPublicRequest", () => {
    const tests = [
      {
        it: "should handle admin path",
        arg: { resource: "/admin/foo" },
        expected: false
      },
      {
        it: "should handle public path",
        arg: { resource: "/public/foo" },
        expected: true
      }
    ];

    tests.forEach(test => {
      it(test.it, () => {
        const actual = entityLib.isPublicRequest(test.arg);
        expect(actual).toEqual(test.expected);
      });
    });
  });

  describe("get", () => {
    it("should return the entity", async () => {
      const entity = { id: "some-id", version: 1 };
      dynamodb.get = jest.fn().mockResolvedValue(entity);
      const result = await entityLib.get("some-table", "some-id");
      expect(result).toEqual(entity);
      expect(dynamodb.get).toHaveBeenCalledWith({
        TableName: "some-table",
        Key: { id: "some-id" },
        ConsistentRead: false,
        ReturnConsumedCapacity: undefined
      });
    });

    it("should return the entity when consistent read is requested", async () => {
      const entity = { id: "some-id", version: 1 };
      dynamodb.get = jest.fn().mockResolvedValue(entity);
      const result = await entityLib.get("some-table", "some-id", true);
      expect(result).toEqual(entity);
      expect(dynamodb.get).toHaveBeenCalledWith({
        TableName: "some-table",
        Key: { id: "some-id" },
        ConsistentRead: true,
        ReturnConsumedCapacity: undefined
      });
    });
  });

  describe("write", () => {
    it("should create the entity when version is 1", async () => {
      const entity = { id: "some-id", version: 1 };
      dynamodb.put = jest.fn().mockResolvedValue();
      await entityLib.write("some-table", entity);
      expect(dynamodb.put).toHaveBeenCalledWith({
        TableName: "some-table",
        Item: entity,
        ConditionExpression: "attribute_not_exists(id)",
        ReturnConsumedCapacity: undefined
      });
    });

    it("should update the entity when version is greater than 1", async () => {
      const entity = { id: "some-id", version: 2 };
      dynamodb.put = jest.fn().mockResolvedValue();
      await entityLib.write("some-table", entity);
      expect(dynamodb.put).toHaveBeenCalledWith({
        TableName: "some-table",
        Item: entity,
        ConditionExpression: "attribute_exists(id) and version = :oldVersion",
        ExpressionAttributeValues: { ":oldVersion": 1 },
        ReturnConsumedCapacity: undefined
      });
    });
  });
});
