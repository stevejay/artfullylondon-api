'use strict';

const dynamoDbClient = require('dynamodb-doc-client-wrapper');

exports.deletePreferencesForUser = userId =>
  dynamoDbClient.delete({
    TableName: process.env.SERVERLESS_PREFERENCES_TABLE_NAME,
    Key: { userId },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });

exports.tryGetPreferencesForUser = userId =>
  dynamoDbClient.tryGet({
    TableName: process.env.SERVERLESS_PREFERENCES_TABLE_NAME,
    Key: { userId },
    ProjectionExpression: 'emailFrequency',
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });

exports.updatePreferencesForUser = (userId, preferences) =>
  dynamoDbClient.put({
    TableName: process.env.SERVERLESS_PREFERENCES_TABLE_NAME,
    Key: { userId },
    Item: preferences,
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });
