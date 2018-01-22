'use strict';

const co = require('co');
const dynamoDbClient = require('dynamodb-doc-client-wrapper');
const constants = require('../constants');

exports.tryGetWatchesByTypeForUser = (userId, entityType) =>
  dynamoDbClient.tryGet({
    TableName: process.env.SERVERLESS_WATCH_TABLE_NAME,
    Key: { userId, entityType },
    ProjectionExpression: 'version, #items',
    ExpressionAttributeNames: { '#items': 'items' },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });

exports.getAllWatchesForUser = userId =>
  dynamoDbClient.query({
    TableName: process.env.SERVERLESS_WATCH_TABLE_NAME,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: { ':userId': userId },
    ProjectionExpression: 'entityType, version, #items',
    ExpressionAttributeNames: { '#items': 'items' },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });

exports.deleteWatchesForUser = deleteRequests => {
  const params = {
    RequestItems: {
      [process.env.SERVERLESS_WATCH_TABLE_NAME]: deleteRequests,
    },
  };

  return dynamoDbClient.batchWriteBasic(params);
};

exports.createOrUpdateWatches = co.wrap(function*(
  currentVersion,
  newVersion,
  userId,
  entityType,
  items
) {
  if (currentVersion === constants.INITIAL_VERSION_NUMBER) {
    // insert using newVersion, checking the entry does not exist already

    yield dynamoDbClient.put({
      TableName: process.env.SERVERLESS_WATCH_TABLE_NAME,
      Item: {
        userId,
        entityType,
        version: newVersion,
        items,
      },
      ConditionExpression:
        'attribute_not_exists(userId) and attribute_not_exists(entityType)',
      ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
    });
  } else {
    // update using newVersion, checking old version equals (newVersion - 1)

    yield dynamoDbClient.put({
      TableName: process.env.SERVERLESS_WATCH_TABLE_NAME,
      Item: {
        userId,
        entityType,
        version: newVersion,
        items,
      },
      ConditionExpression:
        'attribute_exists(userId) and attribute_exists(entityType) and version = :oldVersion',
      ExpressionAttributeValues: { ':oldVersion': newVersion - 1 },
      ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
    });
  }
});
