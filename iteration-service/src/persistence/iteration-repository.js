"use strict";

const dynamodb = require("../external-services/dynamodb");

exports.setIterationEndTimestamp = (actionId, startTimestamp) =>
  dynamodb.update({
    TableName: process.env.SERVERLESS_ITERATON_TABLE_NAME,
    Key: { actionId, startTimestamp },
    UpdateExpression: "set endTimestamp = :endTimestamp",
    ExpressionAttributeValues: {
      ":endTimestamp": Date.now()
    },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

exports.addIteration = iteration =>
  dynamodb.put({
    TableName: process.env.SERVERLESS_ITERATON_TABLE_NAME,
    Item: iteration,
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

exports.getMostRecentIteration = actionId =>
  dynamodb.queryBasic({
    TableName: process.env.SERVERLESS_ITERATON_TABLE_NAME,
    KeyConditionExpression: "actionId = :actionId",
    ExpressionAttributeValues: { ":actionId": actionId },
    Limit: 1,
    ScanIndexForward: false,
    ProjectionExpression: "startTimestamp",
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });
