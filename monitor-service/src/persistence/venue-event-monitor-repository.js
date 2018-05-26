"use strict";

const dynamodb = require("../external-services/dynamodb");

exports.get = (venueId, externalEventId) =>
  dynamodb.get({
    TableName: process.env.SERVERLESS_EVENT_MONITOR_TABLE_NAME,
    Key: { venueId, externalEventId },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

exports.tryGet = (venueId, externalEventId) =>
  dynamodb.tryGet({
    TableName: process.env.SERVERLESS_EVENT_MONITOR_TABLE_NAME,
    Key: { venueId, externalEventId },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

exports.getAllForVenue = venueId =>
  dynamodb.query({
    TableName: process.env.SERVERLESS_EVENT_MONITOR_TABLE_NAME,
    KeyConditionExpression: "venueId = :venueId",
    ExpressionAttributeValues: { ":venueId": venueId },
    ProjectionExpression:
      "venueId, externalEventId, currentUrl, " +
      "title, isIgnored, inArtfully, hasChanged, combinedEvents",
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

exports.update = entity =>
  dynamodb.update({
    TableName: process.env.SERVERLESS_EVENT_MONITOR_TABLE_NAME,
    Key: { venueId: entity.venueId, externalEventId: entity.externalEventId },
    UpdateExpression:
      "SET isIgnored = :isIgnored, hasChanged = :hasChanged REMOVE oldEventText",
    ConditionExpression:
      "attribute_exists(venueId) and attribute_exists(externalEventId)",
    ExpressionAttributeValues: {
      ":isIgnored": entity.isIgnored,
      ":hasChanged": entity.hasChanged
    },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

exports.put = entity =>
  dynamodb.put({
    TableName: process.env.SERVERLESS_EVENT_MONITOR_TABLE_NAME,
    Item: entity,
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

exports.getNewOrChanged = () =>
  dynamodb.scan({
    TableName: process.env.SERVERLESS_EVENT_MONITOR_TABLE_NAME,
    FilterExpression:
      "isIgnored = :false AND " +
      "((inArtfully = :false AND combinedEvents = :false) OR hasChanged = :true)",
    ExpressionAttributeValues: {
      ":false": false,
      ":true": true
    },
    ProjectionExpression: "venueId",
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });
