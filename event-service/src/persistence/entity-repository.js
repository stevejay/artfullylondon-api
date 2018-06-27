import dynamodb from "./dynamodb";

export function write(tableName, entity) {
  return entity.version === 1
    ? dynamodb.put({
        TableName: tableName,
        Item: entity,
        ConditionExpression: "attribute_not_exists(id)"
      })
    : dynamodb.put({
        TableName: tableName,
        Item: entity,
        ConditionExpression: "attribute_exists(id) and version = :oldVersion",
        ExpressionAttributeValues: { ":oldVersion": entity.version - 1 }
      });
}

export function get(tableName, id, consistentRead) {
  return dynamodb.get({
    TableName: tableName,
    Key: { id: id },
    ConsistentRead: !!consistentRead
  });
}

export async function getNextEntityId(tableName, lastId) {
  const result = await dynamodb.scanBasic({
    TableName: tableName,
    ExclusiveStartKey: lastId ? { id: lastId } : null,
    Limit: 1,
    ProjectionExpression: "id",
    ConsistentRead: false
  });
  return result.Items.length > 0 ? result.Items[0].id : null;
}
