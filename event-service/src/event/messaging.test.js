"use strict";

const dynamodb = require("../external-services/dynamodb");
const sns = require("../external-services/sns");
const testData = require("../test-data");
const messaging = require("./messaging");

process.env.SERVERLESS_EVENT_TABLE_NAME = "event-table";
process.env.SERVERLESS_EVENT_BY_VENUE_INDEX_NAME = "event-by-venue";
process.env.SERVERLESS_EVENT_BY_EVENT_SERIES_INDEX_NAME =
  "event-by-event-series";
process.env.SERVERLESS_EVENT_UPDATED_TOPIC_ARN = "event-updated";

describe("event messaging", () => {
  describe("notifyEventsForVenue", () => {
    it("should notify when the venue has related events", async () => {
      dynamodb.query = jest
        .fn()
        .mockResolvedValue([{ id: testData.PERFORMANCE_EVENT_ID }]);

      sns.notify = jest.fn().mockResolvedValue();

      await messaging.notifyEventsForVenue(testData.MINIMAL_VENUE_ID);

      expect(dynamodb.query).toHaveBeenCalledWith({
        TableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
        IndexName: process.env.SERVERLESS_EVENT_BY_VENUE_INDEX_NAME,
        KeyConditionExpression: "venueId = :id",
        ExpressionAttributeValues: { ":id": testData.MINIMAL_VENUE_ID },
        ProjectionExpression: "id",
        ReturnConsumedCapacity: undefined
      });

      expect(sns.notify).toHaveBeenCalledWith(testData.PERFORMANCE_EVENT_ID, {
        arn: process.env.SERVERLESS_EVENT_UPDATED_TOPIC_ARN
      });
    });

    it("should not notify when the venue has zero related events", async () => {
      dynamodb.query = jest.fn().mockResolvedValue([]);
      sns.notify = jest.fn();

      await messaging.notifyEventsForVenue(testData.MINIMAL_VENUE_ID);

      expect(dynamodb.query).toHaveBeenCalledWith({
        TableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
        IndexName: process.env.SERVERLESS_EVENT_BY_VENUE_INDEX_NAME,
        KeyConditionExpression: "venueId = :id",
        ExpressionAttributeValues: { ":id": testData.MINIMAL_VENUE_ID },
        ProjectionExpression: "id",
        ReturnConsumedCapacity: undefined
      });

      expect(sns.notify).not.toHaveBeenCalled();
    });
  });

  describe("notifyEventsForEventSeries", () => {
    it("should notify when the event series has related events", async () => {
      dynamodb.query = jest
        .fn()
        .mockResolvedValue([{ id: testData.PERFORMANCE_EVENT_ID }]);

      sns.notify = jest.fn().mockResolvedValue();

      await messaging.notifyEventsForEventSeries(testData.EVENT_SERIES_ID);

      expect(dynamodb.query).toHaveBeenCalledWith({
        TableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
        IndexName: process.env.SERVERLESS_EVENT_BY_EVENT_SERIES_INDEX_NAME,
        KeyConditionExpression: "eventSeriesId = :id",
        ExpressionAttributeValues: { ":id": testData.EVENT_SERIES_ID },
        ProjectionExpression: "id",
        ReturnConsumedCapacity: undefined
      });

      expect(sns.notify).toHaveBeenCalledWith(testData.PERFORMANCE_EVENT_ID, {
        arn: process.env.SERVERLESS_EVENT_UPDATED_TOPIC_ARN
      });
    });

    it("should not notify when the event series has zero related events", async () => {
      dynamodb.query = jest.fn().mockResolvedValue([]);
      sns.notify = jest.fn();

      await messaging.notifyEventsForEventSeries(testData.EVENT_SERIES_ID);

      expect(dynamodb.query).toHaveBeenCalledWith({
        TableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
        IndexName: process.env.SERVERLESS_EVENT_BY_EVENT_SERIES_INDEX_NAME,
        KeyConditionExpression: "eventSeriesId = :id",
        ExpressionAttributeValues: { ":id": testData.EVENT_SERIES_ID },
        ProjectionExpression: "id",
        ReturnConsumedCapacity: undefined
      });

      expect(sns.notify).not.toHaveBeenCalled();
    });
  });
});
