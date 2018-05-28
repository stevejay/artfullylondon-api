"use strict";

const dynamodb = require("../external-services/dynamodb");
const venueMonitorRepository = require("./venue-monitor-repository");

process.env.SERVERLESS_VENUE_MONITOR_TABLE_NAME = "VenueMonitorTable";

describe("venue-monitor-repository", () => {
  describe("get", () => {
    it("should get a venue monitor", async () => {
      dynamodb.get = jest.fn().mockResolvedValue({ id: "some-id" });

      const response = await venueMonitorRepository.get("almeida-theatre");

      expect(response).toEqual({ id: "some-id" });

      expect(dynamodb.get).toHaveBeenCalledWith({
        TableName: process.env.SERVERLESS_VENUE_MONITOR_TABLE_NAME,
        Key: { venueId: "almeida-theatre" },
        ReturnConsumedCapacity: undefined
      });
    });
  });

  describe("tryGet", () => {
    it("should try to get a venue monitor", async () => {
      dynamodb.tryGet = jest.fn().mockResolvedValue({ id: "some-id" });

      const response = await venueMonitorRepository.tryGet("almeida-theatre");

      expect(response).toEqual({ id: "some-id" });

      expect(dynamodb.tryGet).toHaveBeenCalledWith({
        TableName: process.env.SERVERLESS_VENUE_MONITOR_TABLE_NAME,
        Key: { venueId: "almeida-theatre" },
        ReturnConsumedCapacity: undefined
      });
    });
  });

  describe("update", () => {
    it("should update a venue monitor", async () => {
      dynamodb.update = jest.fn().mockResolvedValue();

      await venueMonitorRepository.update({
        venueId: "almeida-theatre",
        isIgnored: true,
        hasChanged: false
      });

      expect(dynamodb.update).toHaveBeenCalledWith({
        TableName: process.env.SERVERLESS_VENUE_MONITOR_TABLE_NAME,
        Key: { venueId: "almeida-theatre" },
        UpdateExpression:
          "set isIgnored = :isIgnored, hasChanged = :hasChanged",
        ConditionExpression: "attribute_exists(venueId)",
        ExpressionAttributeValues: {
          ":isIgnored": true,
          ":hasChanged": false
        },
        ReturnConsumedCapacity: undefined
      });
    });
  });

  describe("put", () => {
    it("should put a venue monitor", async () => {
      dynamodb.put = jest.fn().mockResolvedValue();

      await venueMonitorRepository.put({
        venueId: "almeida-theatre",
        isIgnored: true,
        hasChanged: false
      });

      expect(dynamodb.put).toHaveBeenCalledWith({
        TableName: process.env.SERVERLESS_VENUE_MONITOR_TABLE_NAME,
        Item: {
          venueId: "almeida-theatre",
          isIgnored: true,
          hasChanged: false
        },
        ReturnConsumedCapacity: undefined
      });
    });
  });

  describe("getChanged", () => {
    it("should get changed venue monitors", async () => {
      dynamodb.scan = jest.fn().mockResolvedValue([{ id: "some-id" }]);

      const response = await venueMonitorRepository.getChanged();

      expect(response).toEqual([{ id: "some-id" }]);

      expect(dynamodb.scan).toHaveBeenCalledWith({
        TableName: process.env.SERVERLESS_VENUE_MONITOR_TABLE_NAME,
        FilterExpression: "isIgnored = :isIgnored AND hasChanged = :hasChanged",
        ExpressionAttributeValues: {
          ":isIgnored": false,
          ":hasChanged": true
        },
        ProjectionExpression: "venueId",
        ReturnConsumedCapacity: undefined
      });
    });
  });
});
