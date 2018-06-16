import elasticsearch from "elasticsearch";
import * as xrayWrapper from "./xray-wrapper";

const client = new elasticsearch.Client({
  host: process.env.ELASTICSEARCH_HOST,
  log: "error"
});

export function bulk(params) {
  return new Promise((resolve, reject) => {
    xrayWrapper.captureAsyncFunc("es bulk update", subsegment => {
      client
        .bulk(params)
        .then(response => {
          if (response.errors) {
            throw new Error(
              "[500] ES Bulk update failed: " + JSON.stringify(response)
            );
          }

          subsegment.close();
          resolve(response);
        })
        .catch(err => {
          subsegment.close(err);
          reject(err);
        });
    });
  });
}

export function search(query) {
  return new Promise((resolve, reject) => {
    xrayWrapper.captureAsyncFunc("es search", subsegment => {
      client
        .search(query)
        .then(response => {
          subsegment.close();
          resolve(response);
        })
        .catch(err => {
          subsegment.close(err);
          reject(err);
        });
    });
  });
}

export function multiSearch(searches, options) {
  return new Promise((resolve, reject) => {
    xrayWrapper.captureAsyncFunc("es multi search", subsegment => {
      client
        .msearch(createMsearchParams(searches, options))
        .then(results => {
          const errors = results.responses
            .filter(response => !!response.error)
            .map(response => response.error);

          if (errors.length) {
            const rootCauses = [];

            errors.forEach(error =>
              error.root_cause.forEach(rootCause =>
                rootCauses.push(rootCause.reason)
              )
            );

            throw new Error("[500] " + rootCauses.join("; "));
          }

          subsegment.close();
          resolve(results);
        })
        .catch(err => {
          subsegment.close(err);
          reject(err);
        });
    });
  });
}

function createMsearchParams(searches, options = {}) {
  return {
    body: searches,
    maxConcurrentSearches: options.maxConcurrentSearches || undefined,
    searchType: options.searchType || "query_then_fetch"
  };
}
