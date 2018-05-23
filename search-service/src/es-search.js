'use strict';

const elasticsearch = require('elasticsearch');

const client = new elasticsearch.Client({
  host: process.env.ELASTICSEARCH_HOST,
  log: 'error',
});

exports.search = (searches, options) => {
  options = options || {};

  return client
    .msearch({
      body: searches,
      maxConcurrentSearches: options.maxConcurrentSearches || undefined,
      searchType: options.searchType || 'query_then_fetch',
    })
    .then(results => {
      const errors = results.responses
        .filter(response => !!response.error)
        .map(response => response.error);

      if (errors.length) {
        const rootCauses = [];

        errors.forEach(error =>
          error.root_cause.forEach(rootCause =>
            rootCauses.push(rootCause.reason)));

        throw new Error('[500] ' + rootCauses.join('; '));
      }

      return results;
    });
};

exports.mget = (index, type, ids, source) => {
  return client.mget({
    index,
    type,
    body: { ids },
    _source: source,
  });
};
