'use strict';

const dynamoDbClient = require('dynamodb-doc-client-wrapper');

module.exports.saveTag = tag =>
  dynamoDbClient.put({
    TableName: process.env.SERVERLESS_TAG_TABLE_NAME,
    Item: tag,
    ConditionExpression:
      'attribute_not_exists(tagType) and attribute_not_exists(id)',
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });

module.exports.deleteTag = (tagType, tagId) =>
  dynamoDbClient.delete({
    TableName: process.env.SERVERLESS_TAG_TABLE_NAME,
    Key: { tagType: tagType, id: tagId },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });

module.exports.getAll = () =>
  dynamoDbClient.scan({
    TableName: process.env.SERVERLESS_TAG_TABLE_NAME,
    ProjectionExpression: 'id, label',
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });

module.exports.getAllByTagType = tagType =>
  dynamoDbClient.query({
    TableName: process.env.SERVERLESS_TAG_TABLE_NAME,
    KeyConditionExpression: 'tagType = :type',
    ExpressionAttributeValues: { ':type': tagType },
    ProjectionExpression: 'id, label',
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });
