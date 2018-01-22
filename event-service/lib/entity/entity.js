'use strict';

const dynamoDbClient = require('dynamodb-doc-client-wrapper');

module.exports.write = (tableName, entity) => {
  if (entity.version === 1) {
    return dynamoDbClient.put({
      TableName: tableName,
      Item: entity,
      ConditionExpression: 'attribute_not_exists(id)',
      ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
    });
  } else {
    return dynamoDbClient.put({
      TableName: tableName,
      Item: entity,
      ConditionExpression: 'attribute_exists(id) and version = :oldVersion',
      ExpressionAttributeValues: { ':oldVersion': entity.version - 1 },
      ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
    });
  }
};

module.exports.get = (tableName, id, consistentRead) => {
  return dynamoDbClient.get({
    TableName: tableName,
    Key: { id: id },
    ConsistentRead: !!consistentRead,
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });
};

const PUBLIC_RESOURCE_REGEX = /^\/public\//i;

module.exports.isPublicRequest = event => {
  return !!event.resource.match(PUBLIC_RESOURCE_REGEX);
};
