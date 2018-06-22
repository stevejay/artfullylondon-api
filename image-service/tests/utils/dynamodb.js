import clientWrapper from "dynamodb-doc-client-wrapper";

const dynamodb = clientWrapper({
  connection: {
    region: "localhost",
    endpoint: "http://localhost:4569"
  }
});

export async function truncateIterationLogTable(tableName) {
  await truncateTableImpl(tableName, "actionId, iterationId");
}

export async function truncateTable(tableName) {
  await truncateTableImpl(tableName, "id");
}

async function truncateTableImpl(tableName, projectionExpression) {
  const items = await dynamodb.scan({
    TableName: tableName,
    ProjectionExpression: projectionExpression
  });

  for (let i = 0; i < items.length; ++i) {
    await dynamodb.delete({
      TableName: tableName,
      Key: items[i]
    });
  }
}

export async function getAllIterationLogs(tableName) {
  return await dynamodb.scan({
    TableName: tableName,
    ProjectionExpression: "actionId, iterationId, errors, completed"
  });
}
