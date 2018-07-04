import dynamodb from "./dynamodb";

export function deletePreferencesForUser(userId) {
  return dynamodb.delete({
    TableName: process.env.SERVERLESS_PREFERENCE_TABLE_NAME,
    Key: { userId }
  });
}

export function tryGetPreferencesForUser(userId) {
  return dynamodb.tryGet({
    TableName: process.env.SERVERLESS_PREFERENCE_TABLE_NAME,
    Key: { userId },
    ProjectionExpression: "emailFrequency"
  });
}

export function updatePreferencesForUser(userId, preferences) {
  return dynamodb.put({
    TableName: process.env.SERVERLESS_PREFERENCE_TABLE_NAME,
    Key: { userId },
    Item: { ...preferences, userId }
  });
}
