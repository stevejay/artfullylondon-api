import dynamodb from "./dynamodb";
import * as entityType from "../entity-type";

export function tryGetWatchesByTypeForUser(userId, entityType) {
  return dynamodb.tryGet({
    TableName: process.env.SERVERLESS_WATCH_TABLE_NAME,
    Key: { userId, entityType },
    ProjectionExpression: "entityType, #items, version",
    ExpressionAttributeNames: { "#items": "items" },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });
}

export function getAllWatchesForUser(userId) {
  return dynamodb.query({
    TableName: process.env.SERVERLESS_WATCH_TABLE_NAME,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: { ":userId": userId },
    ProjectionExpression: "entityType, #items, version",
    ExpressionAttributeNames: { "#items": "items" },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });
}

export function deleteWatchesForUser(userId) {
  // We delete all entity types, but they might not all exist.
  const deleteRequests = entityType.ALLOWED_VALUES.map(entityType => {
    return { DeleteRequest: { Key: { userId, entityType } } };
  });

  const params = {
    RequestItems: {
      [process.env.SERVERLESS_WATCH_TABLE_NAME]: deleteRequests
    }
  };

  return dynamodb.batchWriteBasic(params);
}

export async function createWatches(newVersion, userId, entityType, items) {
  const item = {
    userId,
    entityType,
    items,
    version: newVersion
  };

  await dynamodb.put({
    TableName: process.env.SERVERLESS_WATCH_TABLE_NAME,
    Item: item,
    ConditionExpression:
      "attribute_not_exists(userId) and attribute_not_exists(entityType)",
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });
}

export async function updateWatches(newVersion, userId, entityType, items) {
  const item = {
    userId,
    entityType,
    items,
    version: newVersion
  };

  await dynamodb.put({
    TableName: process.env.SERVERLESS_WATCH_TABLE_NAME,
    Item: item,
    ConditionExpression:
      "attribute_exists(userId) and attribute_exists(entityType) and version = :oldVersion",
    ExpressionAttributeValues: { ":oldVersion": newVersion - 1 },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });
}
