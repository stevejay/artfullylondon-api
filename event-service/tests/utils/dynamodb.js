import clientWrapper from "dynamodb-doc-client-wrapper";

const dynamodb = clientWrapper({
  connection: {
    region: "localhost",
    endpoint: "http://localhost:4569"
  }
});

export async function truncateTable(tableName) {
  const items = await dynamodb.scan({
    TableName: tableName,
    ProjectionExpression: "id"
  });

  for (let i = 0; i < items.length; ++i) {
    await dynamodb.delete({
      TableName: tableName,
      Key: items[i]
    });
  }
}

export async function truncateAllTables() {
  await truncateTable("artfullylondon-development-event");
  await truncateTable("artfullylondon-development-eventseries");
  await truncateTable("artfullylondon-development-talent");
  await truncateTable("artfullylondon-development-venue");
}
