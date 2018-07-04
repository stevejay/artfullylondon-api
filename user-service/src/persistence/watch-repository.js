import dynamodb from "./dynamodb";
import * as watchType from "../watch-type";

export function tryGetWatchesByTypeForUser(userId, watchType) {
  return dynamodb.tryGet({
    TableName: process.env.SERVERLESS_WATCH_TABLE_NAME,
    Key: { userId, watchType },
    ProjectionExpression: "watchType, #items, version",
    ExpressionAttributeNames: { "#items": "items" }
  });
}

export function getAllWatchesForUser(userId) {
  return dynamodb.query({
    TableName: process.env.SERVERLESS_WATCH_TABLE_NAME,
    KeyConditionExpression: "userId = :userId",
    ExpressionAttributeValues: { ":userId": userId },
    ProjectionExpression: "watchType, #items, version",
    ExpressionAttributeNames: { "#items": "items" }
  });
}

export function deleteWatchesForUser(userId) {
  // We delete all entity types, but they might not all exist.
  const deleteRequests = watchType.ALLOWED_VALUES.map(watchType => {
    return { DeleteRequest: { Key: { userId, watchType } } };
  });

  const params = {
    RequestItems: {
      [process.env.SERVERLESS_WATCH_TABLE_NAME]: deleteRequests
    }
  };

  return dynamodb.batchWriteBasic(params);
}

export async function createWatches(newVersion, userId, watchType, items) {
  const item = {
    userId,
    watchType,
    items,
    version: newVersion
  };

  await dynamodb.put({
    TableName: process.env.SERVERLESS_WATCH_TABLE_NAME,
    Item: item,
    ConditionExpression:
      "attribute_not_exists(userId) and attribute_not_exists(watchType)"
  });
}

export async function updateWatches(newVersion, userId, watchType, items) {
  const item = {
    userId,
    watchType,
    items,
    version: newVersion
  };

  await dynamodb.put({
    TableName: process.env.SERVERLESS_WATCH_TABLE_NAME,
    Item: item,
    ConditionExpression:
      "attribute_exists(userId) and attribute_exists(watchType) and version = :oldVersion",
    ExpressionAttributeValues: { ":oldVersion": newVersion - 1 }
  });
}
