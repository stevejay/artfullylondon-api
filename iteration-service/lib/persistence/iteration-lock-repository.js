'use strict';

const dynamoDbClient = require('dynamodb-doc-client-wrapper');

exports.deleteLock = actionId =>
  dynamoDbClient.delete({
    TableName: process.env.SERVERLESS_ITERATON_LOCK_TABLE_NAME,
    Key: { actionId: actionId },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });

exports.addLock = lock =>
  dynamoDbClient.put({
    TableName: process.env.SERVERLESS_ITERATON_LOCK_TABLE_NAME,
    Item: lock,
    ConditionExpression: 'attribute_not_exists(actionId)',
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });
