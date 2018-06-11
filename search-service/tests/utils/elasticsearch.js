import elasticsearch from "elasticsearch";
import jsonfile from "jsonfile";
import path from "path";
import yaml from "js-yaml";
import delay from "delay";
import * as fs from "fs";

const envVars = yaml.safeLoad(fs.readFileSync("./env.yml", "utf8")).development;

const esClient = new elasticsearch.Client({
  host: envVars.ELASTICSEARCH_HOST,
  log: "error"
});

const INDEXES_DIR = path.resolve(__dirname, "../../elasticsearch/indexes");
const TEMPLATES_DIR = path.resolve(__dirname, "../../elasticsearch/templates");

export async function deleteIndex(index) {
  if (await esClient.indices.exists({ index })) {
    await esClient.indices.delete({ index });
  }
}

export async function createIndex(index) {
  await deleteIndex(index);
  const body = jsonfile.readFileSync(path.join(INDEXES_DIR, `${index}.json`));
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
    path.resolve(TEMPLATES_DIR, `${name}.mustache`),
    "utf8"
  );

  await esClient.putScript({
    id: name,
    body: {
      script: {
        lang: "mustache",
        source: text.replace(/\s+/gm, " ")
      }
    }
  });
}

export async function getDocument(index, id) {
  try {
    return await esClient.get({ index, type: "doc", id });
  } catch (err) {
    if (err.statusCode === 404) {
      return null;
    } else {
      throw err;
    }
  }
}

export async function getDocumentWithRetry(index, id, maxTries = 10) {
  for (let i = 0; i < maxTries; i++) {
    const result = await getDocument(index, id);
    if (result) {
      return result;
    } else {
      await delay(1000);
    }
  }

  throw new Error(`Document with id ${id} not found in index ${index}`);
}
