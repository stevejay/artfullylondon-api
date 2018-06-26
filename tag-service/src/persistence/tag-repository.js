import dynamodb from "./dynamodb";

const BASIC_REQUEST = {
  TableName: process.env.SERVERLESS_TAG_TABLE_NAME,
  ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
};

export function createTag(tag) {
  return dynamodb.put({
    ...BASIC_REQUEST,
    Item: tag,
    ConditionExpression:
      "attribute_not_exists(tagType) and attribute_not_exists(id)"
  });
}

export function deleteTag(tagType, tagId) {
  return dynamodb.delete({
    ...BASIC_REQUEST,
    Key: { tagType: tagType, id: tagId }
  });
}

export function getAll() {
  return dynamodb.scan({
    ...BASIC_REQUEST
  });
}

export function getByTagType(tagType) {
  return dynamodb.query({
    ...BASIC_REQUEST,
    KeyConditionExpression: "tagType = :tagType",
    ExpressionAttributeValues: { ":tagType": tagType }
  });
}
