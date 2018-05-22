"use strict";

const dynamodbClient = require("./dynamodb-client");

exports.deletePreferencesForUser = userId =>
  dynamodbClient.delete({
    TableName: process.env.SERVERLESS_PREFERENCES_TABLE_NAME,
    Key: { userId },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

exports.tryGetPreferencesForUser = userId =>
  dynamodbClient.tryGet({
    TableName: process.env.SERVERLESS_PREFERENCES_TABLE_NAME,
    Key: { userId },
    ProjectionExpression: "emailFrequency",
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

exports.updatePreferencesForUser = (userId, preferences) =>
  dynamodbClient.put({
    TableName: process.env.SERVERLESS_PREFERENCES_TABLE_NAME,
    Key: { userId },
    Item: preferences,
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });