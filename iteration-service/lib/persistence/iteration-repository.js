'use strict';

const dynamoDbClient = require('dynamodb-doc-client-wrapper');

module.exports.setIterationEndTimestamp = (actionId, startTimestamp) =>
  dynamoDbClient.update({
    TableName: process.env.SERVERLESS_ITERATON_TABLE_NAME,
    Key: { actionId, startTimestamp },
    UpdateExpression: 'set endTimestamp = :endTimestamp',
    ExpressionAttributeValues: {
      ':endTimestamp': Date.now(),
    },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });

module.exports.addIteration = iteration =>
  dynamoDbClient.put({
    TableName: process.env.SERVERLESS_ITERATON_TABLE_NAME,
    Item: iteration,
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });

module.exports.getMostRecentIteration = actionId =>
  dynamoDbClient.queryBasic({
    TableName: process.env.SERVERLESS_ITERATON_TABLE_NAME,
    KeyConditionExpression: 'actionId = :actionId',
    ExpressionAttributeValues: { ':actionId': actionId },
    Limit: 1,
    ScanIndexForward: false,
    ProjectionExpression: 'startTimestamp',
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });
