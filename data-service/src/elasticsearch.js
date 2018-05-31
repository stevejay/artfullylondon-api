import elasticsearch from "elasticsearch";

const client = new elasticsearch.Client({
  host: process.env.ELASTICSEARCH_HOST,
  log: "error"
});

export function search(params) {
  return client.search(params);
}
