import dynamodb from "./dynamodb";

export function write(tableName, entity) {
  return entity.version === 1
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
}

export function get(tableName, id, consistentRead) {
  return dynamodb.get({
    TableName: tableName,
    Key: { id: id },
    ConsistentRead: !!consistentRead,
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY
  });
}

const PUBLIC_RESOURCE_REGEX = /^\/public\//i;

export function isPublicRequest(event) {
  return !!event.resource.match(PUBLIC_RESOURCE_REGEX);
}
