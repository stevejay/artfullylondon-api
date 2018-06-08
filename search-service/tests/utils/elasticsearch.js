import elasticsearch from "elasticsearch";
import jsonfile from "jsonfile";
import path from "path";
import yaml from "js-yaml";
import * as fs from "fs";

const envVars = yaml.safeLoad(fs.readFileSync("./env.yml", "utf8")).development;

const esClient = new elasticsearch.Client({
  host: envVars.ELASTICSEARCH_HOST,
  log: "error"
});

const MAPPINGS_DIR = path.resolve(__dirname, "../../../elasticsearch");
const TEMPLATES_DIR = path.resolve(__dirname, "../../src/searcher/templates");

export async function deleteIndex(index) {
  if (await esClient.indices.exists({ index })) {
    await esClient.indices.delete({ index });
  }
}

export async function createIndex(index) {
  await deleteIndex(index);
  const body = jsonfile.readFileSync(path.join(MAPPINGS_DIR, `${index}.json`));
  await esClient.indices.create({ index, body });
}

export async function indexDocument(index, document) {
  await esClient.create({
    index,
    type: "doc",
    id: document.id,
    body: document,
    refresh: "true"
  });
}

export async function createTemplate(name) {
  const text = fs.readFileSync(
    path.resolve(TEMPLATES_DIR, `${name}.txt`),
    "utf8"
  );
  await esClient.putScript({
    id: name,
    body: {
      script: {
        lang: "mustache",
        source: text.replace(/\s/gm, "")
      }
    }
  });
}
