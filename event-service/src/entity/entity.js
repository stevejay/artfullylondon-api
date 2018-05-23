"use strict";

const dynamodb = require("../external-services/dynamodb");

exports.write = (tableName, entity) =>
  entity.version === 1
    ? dynamodb.put({
        TableName: tableName,
        Item: entity,
        ConditionExpression: "attribute_not_exists(id)",
        ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
      })
    : dynamodb.put({
        TableName: tableName,
        Item: entity,
        ConditionExpression: "attribute_exists(id) and version = :oldVersion",
        ExpressionAttributeValues: { ":oldVersion": entity.version - 1 },
        ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
      });

exports.get = (tableName, id, consistentRead) =>
  dynamodb.get({
    TableName: tableName,
    Key: { id: id },
    ConsistentRead: !!consistentRead,
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

const PUBLIC_RESOURCE_REGEX = /^\/public\//i;

exports.isPublicRequest = event =>
  !!event.resource.match(PUBLIC_RESOURCE_REGEX);
