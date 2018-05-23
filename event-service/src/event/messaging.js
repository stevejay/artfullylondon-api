"use strict";

const dynamodb = require("../external-services/dynamodb");
const sns = require("../external-services/sns");

exports.notifyEventsForVenue = async function(venueId) {
  const events = await dynamodb.query({
    TableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
    IndexName: process.env.SERVERLESS_EVENT_BY_VENUE_INDEX_NAME,
    KeyConditionExpression: "venueId = :id",
    ExpressionAttributeValues: { ":id": venueId },
    ProjectionExpression: "id",
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

  await Promise.all(
    events.map(event =>
      sns.notify(event.id, {
        arn: process.env.SERVERLESS_EVENT_UPDATED_TOPIC_ARN
      })
    )
  );
};

exports.notifyEventsForEventSeries = async function(eventSeriesId) {
  const events = await dynamodb.query({
    TableName: process.env.SERVERLESS_EVENT_TABLE_NAME,
    IndexName: process.env.SERVERLESS_EVENT_BY_EVENT_SERIES_INDEX_NAME,
    KeyConditionExpression: "eventSeriesId = :id",
    ExpressionAttributeValues: { ":id": eventSeriesId },
    ProjectionExpression: "id",
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

  await Promise.all(
    events.map(event =>
      sns.notify(event.id, {
        arn: process.env.SERVERLESS_EVENT_UPDATED_TOPIC_ARN
      })
    )
  );
};
