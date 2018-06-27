import dynamodb from "./dynamodb";

export function createTag(tag) {
  return dynamodb.put({
    TableName: process.env.SERVERLESS_TAG_TABLE_NAME,
    Item: tag,
    ConditionExpression:
      "attribute_not_exists(tagType) and attribute_not_exists(id)"
  });
}

export function deleteTag(tagType, tagId) {
  return dynamodb.delete({
    TableName: process.env.SERVERLESS_TAG_TABLE_NAME,
    Key: { tagType: tagType, id: tagId }
  });
}

export function getByTagType(tagType) {
  return dynamodb.query({
    TableName: process.env.SERVERLESS_TAG_TABLE_NAME,
    KeyConditionExpression: "tagType = :tagType",
    ExpressionAttributeValues: { ":tagType": tagType }
  });
}
