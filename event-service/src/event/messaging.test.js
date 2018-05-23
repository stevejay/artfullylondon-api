"use strict";

const dynamoDbClient = require("dynamodb-doc-client-wrapper");
const testData = require("../test-data");
const globalMessaging = require("../external-services/sns");
const sns = require("./messaging");

process.env.SERVERLESS_EVENT_TABLE_NAME = "event-table";
process.env.SERVERLESS_EVENT_BY_VENUE_INDEX_NAME = "event-by-venue";
process.env.SERVERLESS_EVENT_BY_EVENT_SERIES_INDEX_NAME =
  "event-by-event-series";
process.env.SERVERLESS_EVENT_UPDATED_TOPIC_ARN = "event-updated";

describe("event sns", () => {
  describe("notifyEventsForVenue", () => {
    afterEach(() => {
      dynamoDbClient.query.restore();
      globalMessaging.notify.restore();
    });

    it("should notify when the venue has related events", done => {
      sinon.stub(dynamoDbClient, "query").callsFake(params => {
        try {
          expect(params).toEqual({
            TableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
            IndexName: process.env.SERVERLESS_EVENT_BY_VENUE_INDEX_NAME,
            KeyConditionExpression: "venueId = :id",
            ExpressionAttributeValues: { ":id": testData.MINIMAL_VENUE_ID },
            ProjectionExpression: "id",
            ReturnConsumedCapacity: undefined
          });
        } catch (err) {
          return Promise.reject(new Error(err));
        }

        return Promise.resolve([{ id: testData.PERFORMANCE_EVENT_ID }]);
      });

      sinon.stub(globalMessaging, "notify").callsFake((body, headers) => {
        try {
          expect(body).toEqual(testData.PERFORMANCE_EVENT_ID);
          expect(headers).toEqual({
            arn: process.env.SERVERLESS_EVENT_UPDATED_TOPIC_ARN
          });
        } catch (err) {
          return Promise.reject(new Error(err));
        }

        return Promise.resolve();
      });

      co(sns.notifyEventsForVenue(testData.MINIMAL_VENUE_ID))
        .then(() => done())
        .catch(err => done(err));
    });

    it("should not notify when the venue has zero related events", done => {
      sinon.stub(dynamoDbClient, "query").callsFake(params => {
        try {
          expect(params).toEqual({
            TableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
            IndexName: process.env.SERVERLESS_EVENT_BY_VENUE_INDEX_NAME,
            KeyConditionExpression: "venueId = :id",
            ExpressionAttributeValues: { ":id": testData.MINIMAL_VENUE_ID },
            ProjectionExpression: "id",
            ReturnConsumedCapacity: undefined
          });
        } catch (err) {
          return Promise.reject(new Error(err));
        }

        return Promise.resolve([]);
      });

      sinon.stub(globalMessaging, "notify").callsFake(() => {
        return Promise.reject(new Error("notify should not have been invoked"));
      });

      co(sns.notifyEventsForVenue(testData.MINIMAL_VENUE_ID))
        .then(() => done())
        .catch(err => done(err));
    });
  });

  describe("notifyEventsForEventSeries", () => {
    afterEach(() => {
      dynamoDbClient.query.restore();
      globalMessaging.notify.restore();
    });

    it("should notify when the event series has related events", done => {
      sinon.stub(dynamoDbClient, "query").callsFake(params => {
        try {
          expect(params).toEqual({
            TableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
            IndexName: process.env.SERVERLESS_EVENT_BY_EVENT_SERIES_INDEX_NAME,
            KeyConditionExpression: "eventSeriesId = :id",
            ExpressionAttributeValues: { ":id": testData.EVENT_SERIES_ID },
            ProjectionExpression: "id",
            ReturnConsumedCapacity: undefined
          });
        } catch (err) {
          return Promise.reject(new Error(err));
        }

        return Promise.resolve([{ id: testData.PERFORMANCE_EVENT_ID }]);
      });

      sinon.stub(globalMessaging, "notify").callsFake((body, headers) => {
        try {
          expect(body).toEqual(testData.PERFORMANCE_EVENT_ID);
          expect(headers).toEqual({
            arn: process.env.SERVERLESS_EVENT_UPDATED_TOPIC_ARN
          });
        } catch (err) {
          return Promise.reject(new Error(err));
        }

        return Promise.resolve();
      });

      co(sns.notifyEventsForEventSeries(testData.EVENT_SERIES_ID))
        .then(() => done())
        .catch(err => done(err));
    });

    it("should not notify when the event series has zero related events", done => {
      sinon.stub(dynamoDbClient, "query").callsFake(params => {
        try {
          expect(params).toEqual({
            TableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
            IndexName: process.env.SERVERLESS_EVENT_BY_EVENT_SERIES_INDEX_NAME,
            KeyConditionExpression: "eventSeriesId = :id",
            ExpressionAttributeValues: { ":id": testData.EVENT_SERIES_ID },
            ProjectionExpression: "id",
            ReturnConsumedCapacity: undefined
          });
        } catch (err) {
          return Promise.reject(new Error(err));
        }

        return Promise.resolve([]);
      });

      sinon.stub(globalMessaging, "notify").callsFake(() => {
        return Promise.reject(new Error("notify should not have been invoked"));
      });

      co(sns.notifyEventsForEventSeries(testData.EVENT_SERIES_ID))
        .then(() => done())
        .catch(err => done(err));
    });
  });
});
