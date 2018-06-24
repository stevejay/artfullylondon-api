import elasticsearch from "elasticsearch";
import jsonfile from "jsonfile";
import path from "path";
import yaml from "js-yaml";
import delay from "delay";
import * as fs from "fs";
import * as log from "loglevel";

const envVars = yaml.safeLoad(fs.readFileSync("./env.yml", "utf8")).development;

const esClient = new elasticsearch.Client({
  host: envVars.ELASTICSEARCH_HOST,
  log: "error"
});

const INDEXES_DIR = path.resolve(__dirname, "../../elasticsearch/indexes");

export async function deleteIndex(index) {
  if (await esClient.indices.exists({ index })) {
    await esClient.indices.delete({ index });
  }

  let count = 0;
  for (;;) {
    await delay(500);
    const exists = await esClient.indices.exists({ index });
    if (!exists) {
      return;
    } else {
      log.warn(`Index '${index}' found to still exist`);
      ++count;
    }

    if (count >= 10) {
      throw new Error(`Failed to delete index '${index}'`);
    }
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
