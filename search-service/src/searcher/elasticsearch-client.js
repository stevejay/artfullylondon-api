import elasticsearch from "elasticsearch";

const client = new elasticsearch.Client({
  host: process.env.ELASTICSEARCH_HOST,
  log: "error"
});

export function search(query) {
  return client.search(query);
}

export function searchUsingTemplate(name, index, params) {
  return client.searchTemplate({
    index,
    type: "doc",
    body: { id: name, params }
  });
}

export async function multiSearch(searches, options) {
  options = options || {};

  const results = await client.msearch({
    body: searches,
    maxConcurrentSearches: options.maxConcurrentSearches || undefined,
    searchType: options.searchType || "query_then_fetch"
  });

  const errors = results.responses
    .filter(response => !!response.error)
    .map(response => response.error);

  if (errors.length) {
    const rootCauses = [];

    errors.forEach(error =>
      error.root_cause.forEach(rootCause => rootCauses.push(rootCause.reason))
    );

    throw new Error("[500] msearch failed: " + rootCauses.join("; "));
  }

  return results;
}
