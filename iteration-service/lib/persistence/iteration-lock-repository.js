'use strict';

const dynamoDbClient = require('dynamodb-doc-client-wrapper');

module.exports.deleteLock = actionId =>
  dynamoDbClient.delete({
    TableName: process.env.SERVERLESS_ITERATON_LOCK_TABLE_NAME,
    Key: { actionId: actionId },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });

module.exports.addLock = lock =>
  dynamoDbClient.put({
    TableName: process.env.SERVERLESS_ITERATON_LOCK_TABLE_NAME,
    Item: lock,
    ConditionExpression: 'attribute_not_exists(actionId)',
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });
