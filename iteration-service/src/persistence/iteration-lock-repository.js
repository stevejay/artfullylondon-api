"use strict";

const dynamodb = require("../external-services/dynamodb");

exports.deleteLock = actionId =>
  dynamodb.delete({
    TableName: process.env.SERVERLESS_ITERATON_LOCK_TABLE_NAME,
    Key: { actionId: actionId },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });

exports.addLock = lock =>
  dynamodb.put({
    TableName: process.env.SERVERLESS_ITERATON_LOCK_TABLE_NAME,
    Item: lock,
    ConditionExpression: "attribute_not_exists(actionId)",
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });
