"use strict";

const elasticsearch = require("elasticsearch");
const yaml = require("js-yaml");
const fs = require("fs");

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

async function deleteElasticsearchIndex(index) {
  if (await esClient.indices.exists({ index })) {
    await esClient.indices.delete({ index });
  }
}

async function createElasticsearchIndex(index) {
  const mappingJson = require(`../../../elasticsearch/${index}.json`);
  await deleteElasticsearchIndex(index);
  await esClient.indices.create({ index, body: mappingJson });
}

async function indexDocument(index, doc) {
  await esClient.create({
    index,
    type: "doc",
    id: doc.id,
    body: doc,
    refresh: "true"
  });
}

async function getDocument(index, id) {
  return await esClient.get({
    index,
    type: "doc",
    id
  });
}

exports.createElasticsearchIndex = createElasticsearchIndex;
exports.deleteElasticsearchIndex = deleteElasticsearchIndex;
exports.indexDocument = indexDocument;
exports.getDocument = getDocument;
