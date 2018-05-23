"use strict";

const dynamodb = require("serverless-dynamodb-client");

const dynamodbClient = require("dynamodb-doc-client-wrapper")({
  documentClient: dynamodb.doc
});

exports.saveTag = tag =>
  dynamodbClient.put({
    TableName: process.env.SERVERLESS_TAG_TABLE_NAME,
    Item: tag,
    ConditionExpression:
      "attribute_not_exists(tagType) and attribute_not_exists(id)",
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

exports.deleteTag = (tagType, tagId) =>
  dynamodbClient.delete({
    TableName: process.env.SERVERLESS_TAG_TABLE_NAME,
    Key: { tagType: tagType, id: tagId },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

exports.getAll = () =>
  dynamodbClient.scan({
    TableName: process.env.SERVERLESS_TAG_TABLE_NAME,
    ProjectionExpression: "id, label",
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

exports.getAllByTagType = tagType =>
  dynamodbClient.query({
    TableName: process.env.SERVERLESS_TAG_TABLE_NAME,
    KeyConditionExpression: "tagType = :type",
    ExpressionAttributeValues: { ":type": tagType },
    ProjectionExpression: "id, label",
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });
