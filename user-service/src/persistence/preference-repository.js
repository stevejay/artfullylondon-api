import dynamodb from "./dynamodb";

export function deletePreferencesForUser(userId) {
  return dynamodb.delete({
    TableName: process.env.SERVERLESS_PREFERENCES_TABLE_NAME,
    Key: { userId },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });
}

export function tryGetPreferencesForUser(userId) {
  return dynamodb.tryGet({
    TableName: process.env.SERVERLESS_PREFERENCES_TABLE_NAME,
    Key: { userId },
    ProjectionExpression: "emailFrequency",
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });
}

export function updatePreferencesForUser(userId, preferences) {
  return dynamodb.put({
    TableName: process.env.SERVERLESS_PREFERENCES_TABLE_NAME,
    Key: { userId },
    Item: { ...preferences, userId },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });
}
