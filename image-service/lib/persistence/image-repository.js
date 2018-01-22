'use strict';

const dynamoDbClient = require('dynamodb-doc-client-wrapper');

module.exports.getImage = imageId =>
  dynamoDbClient.get({
    TableName: process.env.SERVERLESS_IMAGE_TABLE_NAME,
    Key: { id: imageId },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });

module.exports.tryGetImage = imageId =>
  dynamoDbClient.tryGet({
    TableName: process.env.SERVERLESS_IMAGE_TABLE_NAME,
    Key: { id: imageId },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });

module.exports.getNextImage = lastId =>
  dynamoDbClient
    .scanBasic({
      TableName: process.env.SERVERLESS_IMAGE_TABLE_NAME,
      ExclusiveStartKey: lastId || null,
      Limit: 1,
      ProjectionExpression: 'id',
      ConsistentRead: false,
      ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
    })
    .then(result => (result.Items.length > 0 ? result.Items[0] : null));

module.exports.saveImage = (image, shouldAlreadyExist) =>
  dynamoDbClient.put({
    TableName: process.env.SERVERLESS_IMAGE_TABLE_NAME,
    Item: image,
    ConditionExpression: shouldAlreadyExist
      ? 'attribute_exists(id)'
      : 'attribute_not_exists(id)',
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
  });
