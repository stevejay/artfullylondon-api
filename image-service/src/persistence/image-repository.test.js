"use strict";

const dynamodb = require("../external-services/dynamodb");
const imageRepository = require("./image-repository");

process.env.SERVERLESS_IMAGE_TABLE_NAME = "ImageTable";

const sync = fn =>
  fn.then(res => () => res).catch(err => () => {
    throw err;
  });

describe("image-repository", () => {
  describe("saveImage", () => {
    it("should save a new image", async () => {
      dynamodb.put = jest.fn().mockResolvedValue();

      await imageRepository.saveImage({ id: "image-1" }, false);

      expect(dynamodb.put).toHaveBeenCalledWith({
        TableName: process.env.SERVERLESS_IMAGE_TABLE_NAME,
        Item: { id: "image-1" },
        ConditionExpression: "attribute_not_exists(id)",
        ReturnConsumedCapacity: undefined
      });
    });

    it("should save an existing image", async () => {
      dynamodb.put = jest.fn().mockResolvedValue();

      await imageRepository.saveImage({ id: "image-1" }, true);

      expect(dynamodb.put).toHaveBeenCalledWith({
        TableName: process.env.SERVERLESS_IMAGE_TABLE_NAME,
        Item: { id: "image-1" },
        ConditionExpression: "attribute_exists(id)",
        ReturnConsumedCapacity: undefined
      });
    });
  });

  describe("getNextImage", () => {
    it("should get the next image when there is one", async () => {
      dynamodb.scanBasic = jest.fn().mockResolvedValue({
        Items: [{ id: "image-2", path: "/some/path" }]
      });

      const result = await imageRepository.getNextImage("image-1");

      expect(result).toEqual({ id: "image-2", path: "/some/path" });

      expect(dynamodb.scanBasic).toHaveBeenCalledWith({
        TableName: process.env.SERVERLESS_IMAGE_TABLE_NAME,
        ExclusiveStartKey: "image-1",
        Limit: 1,
        ProjectionExpression: "id",
        ConsistentRead: false,
        ReturnConsumedCapacity: undefined
      });
    });

    it("should handle getting the next image when there is none", async () => {
      dynamodb.scanBasic = jest.fn().mockResolvedValue({
        Items: []
      });

      const result = await imageRepository.getNextImage("image-1");

      expect(result).toEqual(null);

      expect(dynamodb.scanBasic).toHaveBeenCalledWith({
        TableName: process.env.SERVERLESS_IMAGE_TABLE_NAME,
        ExclusiveStartKey: "image-1",
        Limit: 1,
        ProjectionExpression: "id",
        ConsistentRead: false,
        ReturnConsumedCapacity: undefined
      });
    });
  });

  describe("getImage", () => {
    it("should get an image", async () => {
      dynamodb.get = jest
        .fn()
        .mockResolvedValue({ id: "image-1", path: "/some/path" });

      const result = await imageRepository.getImage("image-1");

      expect(result).toEqual({ id: "image-1", path: "/some/path" });

      expect(dynamodb.get).toHaveBeenCalledWith({
        TableName: process.env.SERVERLESS_IMAGE_TABLE_NAME,
        Key: { id: "image-1" },
        ReturnConsumedCapacity: undefined
      });
    });

    it("should handle an error when getting an image", async () => {
      dynamodb.get = jest
        .fn()
        .mockRejectedValue(new Error("deliberately thrown"));

      expect(await sync(imageRepository.getImage("image-1"))).toThrow(
        /deliberately thrown/
      );
    });
  });

  describe("tryGetImage", () => {
    it("should get an image", async () => {
      dynamodb.tryGet = jest
        .fn()
        .mockResolvedValue({ id: "image-1", path: "/some/path" });

      const result = await imageRepository.tryGetImage("image-1");

      expect(result).toEqual({ id: "image-1", path: "/some/path" });

      expect(dynamodb.tryGet).toHaveBeenCalledWith({
        TableName: process.env.SERVERLESS_IMAGE_TABLE_NAME,
        Key: { id: "image-1" },
        ReturnConsumedCapacity: undefined
      });
    });

    it("should handle not finding an image", async () => {
      dynamodb.tryGet = jest.fn().mockResolvedValue(null);
      const result = await imageRepository.tryGetImage("image-1");
      expect(result).toEqual(null);
    });
  });
});
