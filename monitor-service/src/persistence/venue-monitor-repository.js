"use strict";

const dynamodb = require("../external-services/dynamodb");

exports.get = venueId =>
  dynamodb.get({
    TableName: process.env.SERVERLESS_VENUE_MONITOR_TABLE_NAME,
    Key: { venueId },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

exports.tryGet = venueId =>
  dynamodb.tryGet({
    TableName: process.env.SERVERLESS_VENUE_MONITOR_TABLE_NAME,
    Key: { venueId },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

exports.update = entity =>
  dynamodb.update({
    TableName: process.env.SERVERLESS_VENUE_MONITOR_TABLE_NAME,
    Key: { venueId: entity.venueId },
    UpdateExpression: "set isIgnored = :isIgnored, hasChanged = :hasChanged",
    ConditionExpression: "attribute_exists(venueId)",
    ExpressionAttributeValues: {
      ":isIgnored": entity.isIgnored,
      ":hasChanged": entity.hasChanged
    },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

exports.put = entity =>
  dynamodb.put({
    TableName: process.env.SERVERLESS_VENUE_MONITOR_TABLE_NAME,
    Item: entity,
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

exports.getChanged = () =>
  dynamodb.scan({
    TableName: process.env.SERVERLESS_VENUE_MONITOR_TABLE_NAME,
    FilterExpression: "isIgnored = :isIgnored AND hasChanged = :hasChanged",
    ExpressionAttributeValues: {
      ":isIgnored": false,
      ":hasChanged": true
    },
    ProjectionExpression: "venueId",
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });
