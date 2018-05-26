"use strict";

const dynamodb = require("../external-services/dynamodb");
const venueEventMonitorRepository = require("./venue-event-monitor-repository");

process.env.SERVERLESS_EVENT_MONITOR_TABLE_NAME = "VenueEventMonitorTable";

describe("venue-event-monitor-repository", () => {
  describe("tryGet", () => {
    it("should get a venue event monitor", async () => {
      dynamodb.tryGet = jest.fn().mockResolvedValue({ id: "some-id" });

      const response = await venueEventMonitorRepository.tryGet(
        "almeida-theatre",
        "external-id"
      );

      expect(response).toEqual({ id: "some-id" });

      expect(dynamodb.tryGet).toHaveBeenCalledWith({
        TableName: process.env.SERVERLESS_EVENT_MONITOR_TABLE_NAME,
        Key: { venueId: "almeida-theatre", externalEventId: "external-id" },
        ReturnConsumedCapacity: undefined
      });
    });
  });

  describe("getAllForVenue", () => {
    it("should get all venue event monitors for a venue", async () => {
      dynamodb.query = jest.fn().mockResolvedValue([{ id: "some-id" }]);

      const response = await venueEventMonitorRepository.getAllForVenue(
        "almeida-theatre"
      );

      expect(response).toEqual([{ id: "some-id" }]);

      expect(dynamodb.query).toHaveBeenCalledWith({
        TableName: process.env.SERVERLESS_EVENT_MONITOR_TABLE_NAME,
        KeyConditionExpression: "venueId = :venueId",
        ExpressionAttributeValues: { ":venueId": "almeida-theatre" },
        ProjectionExpression:
          "venueId, externalEventId, currentUrl, " +
          "title, isIgnored, inArtfully, hasChanged, combinedEvents",
        ReturnConsumedCapacity: undefined
      });
    });
  });

  describe("update", () => {
    it("should update a venue event monitor", async () => {
      dynamodb.update = jest.fn().mockResolvedValue();

      await venueEventMonitorRepository.update({
        venueId: "almeida-theatre",
        externalEventId: "some-external-id",
        isIgnored: true,
        hasChanged: false
      });

      expect(dynamodb.update).toHaveBeenCalledWith({
        TableName: process.env.SERVERLESS_EVENT_MONITOR_TABLE_NAME,
        Key: {
          venueId: "almeida-theatre",
          externalEventId: "some-external-id"
        },
        UpdateExpression:
          "SET isIgnored = :isIgnored, hasChanged = :hasChanged REMOVE oldEventText",
        ConditionExpression:
          "attribute_exists(venueId) and attribute_exists(externalEventId)",
        ExpressionAttributeValues: {
          ":isIgnored": true,
          ":hasChanged": false
        },
        ReturnConsumedCapacity: undefined
      });
    });
  });

  describe("put", () => {
    it("should handle putting an entity", async () => {
      dynamodb.put = jest.fn().mockResolvedValue();

      await venueEventMonitorRepository.put({ id: "some-id" });

      expect(dynamodb.put).toHaveBeenCalledWith({
        TableName: process.env.SERVERLESS_EVENT_MONITOR_TABLE_NAME,
        Item: { id: "some-id" },
        ReturnConsumedCapacity: undefined
      });
    });
  });

  describe("getNewOrChanged", () => {
    it("should handle a valid request", async () => {
      dynamodb.scan = jest.fn().mockResolvedValue([{ id: "some-id" }]);

      const response = await venueEventMonitorRepository.getNewOrChanged();

      expect(response).toEqual([{ id: "some-id" }]);

      expect(dynamodb.scan).toHaveBeenCalledWith({
        TableName: process.env.SERVERLESS_EVENT_MONITOR_TABLE_NAME,
        FilterExpression:
          "isIgnored = :false AND " +
          "((inArtfully = :false AND combinedEvents = :false) OR hasChanged = :true)",
        ExpressionAttributeValues: {
          ":false": false,
          ":true": true
        },
        ProjectionExpression: "venueId",
        ReturnConsumedCapacity: undefined
      });
    });
  });
});
