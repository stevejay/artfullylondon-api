'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://events.arts.ac.uk';

module.exports.minimumExpectedEvents = 0;

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  let $ = yield pageLoader(
    BASE_URL +
      '/eventpage?pg=1&programmes=Wimbledon%20College%20of%20Arts&types=all&keyword=wimbledonspace'
  );

  $('.search-results-list a.eventname').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('[id=\'thePage:longdesc\']').html();
  return { title, data };
});
