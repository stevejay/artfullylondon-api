const elasticsearch = require("elasticsearch");
const jsonfile = require("jsonfile");
const path = require("path");
const log = require("loglevel");

const args = process.argv.slice(2);

const esClient = new elasticsearch.Client({
  host: args[0],
  log: "error"
});

const INDEXES_DIR = path.resolve(__dirname, "./indexes");

async function deleteIndex(index) {
  if (await esClient.indices.exists({ index })) {
    await esClient.indices.delete({ index });
  }
}

async function createIndex(index) {
  await deleteIndex(index);
  const body = jsonfile.readFileSync(path.join(INDEXES_DIR, `${index}.json`));
  await esClient.indices.create({ index, body });
}

(async () => {
  await createIndex("autocomplete");
  await createIndex("talent");
  await createIndex("venue");
  await createIndex("event");
  await createIndex("event-series");
})().catch(err => {
  log.error(`CAUGHT ERROR: ${err.message}`);
});
