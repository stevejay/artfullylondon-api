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

export async function getNextEntity(tableName, lastId) {
  const result = await dynamodb.scanBasic({
    TableName: tableName,
    ReturnConsumedCapacity: process.env.RETURN_CONSUMED_CAPACITY,
    ExclusiveStartKey: lastId ? { id: lastId } : null,
    Limit: 1,
    ProjectionExpression: "id",
    ConsistentRead: false
  });
  return result.Items.length > 0 ? result.Items[0] : null;
}
