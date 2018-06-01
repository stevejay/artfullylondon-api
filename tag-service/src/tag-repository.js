import dynamodb from "./external-services/dynamodb";

export function saveTag(tag) {
  return dynamodb.put({
    TableName: process.env.SERVERLESS_TAG_TABLE_NAME,
    Item: tag,
    ConditionExpression:
      "attribute_not_exists(tagType) and attribute_not_exists(id)",
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });
}

export function deleteTag(tagType, tagId) {
  return dynamodb.delete({
    TableName: process.env.SERVERLESS_TAG_TABLE_NAME,
    Key: { tagType: tagType, id: tagId },
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });
}

export function getAll() {
  return dynamodb.scan({
    TableName: process.env.SERVERLESS_TAG_TABLE_NAME,
    ProjectionExpression: "id, label",
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });
}

export function getAllByTagType(tagType) {
  return dynamodb.query({
    TableName: process.env.SERVERLESS_TAG_TABLE_NAME,
    KeyConditionExpression: "tagType = :type",
    ExpressionAttributeValues: { ":type": tagType },
    ProjectionExpression: "id, label",
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });
}
