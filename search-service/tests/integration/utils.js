"use strict";

const elasticsearch = require("elasticsearch");
const yaml = require("js-yaml");
const fs = require("fs");

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

module.exports.createElasticsearchIndex = createElasticsearchIndex;
module.exports.deleteElasticsearchIndex = deleteElasticsearchIndex;
module.exports.indexDocument = indexDocument;
