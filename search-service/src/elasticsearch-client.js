import elasticsearch from "elasticsearch";

const client = new elasticsearch.Client({
  host: process.env.ELASTICSEARCH_HOST,
  log: "error"
});

export function bulk(params) {
  return new Promise((resolve, reject) => {
    client.bulk(params, (err, response) => {
      if (err) {
        reject(err);
      } else if (response.errors) {
        reject(new Error(JSON.stringify(response)));
      } else {
        resolve(response);
      }
    });
  });
}

export function search(query) {
  return client.search(query);
}

export function multiSearch(searches, options) {
  return client.msearch(createMsearchParams(searches, options));
}

export function templateSearch(name, index, params) {
  return client.searchTemplate({
    index,
    type: "doc",
    body: { id: name, params }
  });
}

export async function templateMultiSearch(searches, options) {
  return client.msearchTemplate(createMsearchParams(searches, options));
}

function createMsearchParams(searches, options = {}) {
  return {
    body: searches,
    maxConcurrentSearches: options.maxConcurrentSearches || undefined,
    searchType: options.searchType || "query_then_fetch"
  };
}
