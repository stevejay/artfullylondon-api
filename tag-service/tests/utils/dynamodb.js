import clientWrapper from "dynamodb-doc-client-wrapper";

const dynamodb = clientWrapper({
  connection: {
    region: "localhost",
    endpoint: "http://localhost:4569"
  }
});

exports.truncateTagTable = async function(tableName) {
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
};
