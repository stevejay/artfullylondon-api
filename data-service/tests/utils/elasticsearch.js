import elasticsearch from "elasticsearch";
import jsonfile from "jsonfile";
import path from "path";

const esClient = new elasticsearch.Client({
  host: "http://localhost:4571",
  log: "error"
});

export async function deleteIndex(index) {
  if (await esClient.indices.exists({ index })) {
    await esClient.indices.delete({ index });
  }
}

export async function createIndex(index) {
  await deleteIndex(index);
  const mappingsDir = path.resolve(__dirname, "../../../elasticsearch");
  const body = jsonfile.readFileSync(path.join(mappingsDir, `${index}.json`));
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
