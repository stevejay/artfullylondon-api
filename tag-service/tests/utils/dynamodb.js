import clientWrapper from "dynamodb-doc-client-wrapper";

const dynamodb = clientWrapper({
  connection: {
    region: "localhost",
    endpoint: "http://localhost:4569"
  }
});

export async function truncateTagTable(tableName) {
  const items = await dynamodb.scan({
    TableName: tableName,
    ProjectionExpression: "id, tagType"
  });

  for (let i = 0; i < items.length; ++i) {
    await dynamodb.delete({
      TableName: tableName,
      Key: items[i]
    });
  }
}

export async function addToTable(tableName, item) {
  return dynamodb.put({ TableName: tableName, Item: item });
}
