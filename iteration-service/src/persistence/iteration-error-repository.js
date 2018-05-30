"use strict";

const dynamodb = require("../external-services/dynamodb");

exports.saveError = iterationError =>
  dynamodb.put({
    TableName: process.env.SERVERLESS_ITERATON_ERROR_TABLE_NAME,
    Item: iterationError,
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

exports.getErrorsForIteration = key =>
  dynamodb.query({
    TableName: process.env.SERVERLESS_ITERATON_ERROR_TABLE_NAME,
    KeyConditionExpression: "actionIdStartTimestamp = :actionIdStartTimestamp",
    ExpressionAttributeValues: { ":actionIdStartTimestamp": key },
    ProjectionExpression: "entityId, message",
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });
