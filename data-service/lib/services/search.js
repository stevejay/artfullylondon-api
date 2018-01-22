'use strict';

const esSearch = require('../external-services/elasticsearch');
const co = require('co');
const date = require('../date');

module.exports.getSitemapLinks = co.wrap(function*(dateTo) {
  const formattedDate = date.formatDate(dateTo);

  const searchResult = yield esSearch.search({
    index: 'event-full',
    type: 'default',
    body: {
      _source: 'id',
      from: 0,
      size: 5000,
      query: {
        bool: {
          filter: [{ term: { status: 'Active' } }],
          should: [
            { term: { occurrenceType: 'Continuous' } },
            { range: { dateTo: { gte: formattedDate } } },
          ],
          minimum_should_match: 1,
        },
      },
    },
  });

  const links = searchResult.hits.hits.map(
    hit => 'https://www.artfully.london/event/' + hit._source.id
  );

  return links;
});
