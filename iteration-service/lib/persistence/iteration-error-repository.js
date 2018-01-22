'use strict';

const dynamoDbClient = require('dynamodb-doc-client-wrapper');

module.exports.saveError = iterationError =>
  dynamoDbClient.put({
    TableName: process.env.SERVERLESS_ITERATON_ERROR_TABLE_NAME,
    Item: iterationError,
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });

module.exports.getErrorsForIteration = key =>
  dynamoDbClient.query({
    TableName: process.env.SERVERLESS_ITERATON_ERROR_TABLE_NAME,
    KeyConditionExpression: 'actionIdStartTimestamp = :actionIdStartTimestamp',
    ExpressionAttributeValues: { ':actionIdStartTimestamp': key },
    ProjectionExpression: 'entityId, message',
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });
