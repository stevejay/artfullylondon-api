"use strict";

const dynamodb = require("../external-services/dynamodb");

exports.getImage = imageId =>
  dynamodb.get({
    TableName: process.env.SERVERLESS_IMAGE_TABLE_NAME,
    Key: { id: imageId },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

exports.tryGetImage = imageId =>
  dynamodb.tryGet({
    TableName: process.env.SERVERLESS_IMAGE_TABLE_NAME,
    Key: { id: imageId },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

exports.getNextImage = lastId =>
  dynamodb
    .scanBasic({
      TableName: process.env.SERVERLESS_IMAGE_TABLE_NAME,
      ExclusiveStartKey: lastId || null,
      Limit: 1,
      ProjectionExpression: "id",
      ConsistentRead: false,
      ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
    })
    .then(result => (result.Items.length > 0 ? result.Items[0] : null));

exports.saveImage = (image, shouldAlreadyExist) =>
  dynamodb.put({
    TableName: process.env.SERVERLESS_IMAGE_TABLE_NAME,
    Item: image,
    ConditionExpression: shouldAlreadyExist
      ? "attribute_exists(id)"
      : "attribute_not_exists(id)",
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });
