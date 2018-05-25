"use strict";

const elasticsearch = require("elasticsearch");
const yaml = require("js-yaml");
const fs = require("fs");

const dynamodb = require("dynamodb-doc-client-wrapper")({
  connection: {
    region: "localhost",
    endpoint: "http://localhost:8000"
  }
});

exports.EDITOR_AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiY29nbml0bzp1c2VybmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ._ANmL9jse6JQCwQJumzBEH6omY7OjFFSFYJdS5wdeZE";

exports.READONLY_AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiY29nbml0bzp1c2VybmFtZSI6InJlYWRvbmx5IiwiaWF0IjoxNTE2MjM5MDIyfQ.muh1Jbhv-kBuwZ3pNeDNh8_53iGvs25EwPCAvcvgaWQ";

exports.API_KEY = "dddddddddddddddddddddddddddddddd";

exports.sync = fn =>
  fn.then(res => () => res).catch(err => () => {
    throw err;
  });

const envVars = yaml.safeLoad(fs.readFileSync("./env.yml", "utf8")).development;

const esClient = new elasticsearch.Client({
  host: envVars.ELASTICSEARCH_HOST,
  log: "error"
});

exports.deleteElasticsearchIndex = async function(index) {
  if (await esClient.indices.exists({ index })) {
    await esClient.indices.delete({ index });
  }
};

exports.createElasticsearchIndex = async function(index) {
  const mappingJson = require(`../../../elasticsearch/${index}.json`);
  await exports.deleteElasticsearchIndex(index);
  await esClient.indices.create({ index, body: mappingJson });
};

exports.indexDocument = async function(index, doc) {
  await esClient.create({
    index,
    type: "doc",
    id: doc.id,
    body: doc,
    refresh: "true"
  });
};

exports.getDocument = async function(index, id) {
  return await esClient.get({
    index,
    type: "doc",
    id
  });
};

exports.truncateTable = async function(tableName) {
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
};

exports.truncateAllTables = async function() {
  await exports.truncateTable("artfullylondon-development-event");
  await exports.truncateTable("artfullylondon-development-eventseries");
  await exports.truncateTable("artfullylondon-development-talent");
  await exports.truncateTable("artfullylondon-development-venue");
};
