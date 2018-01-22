'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

// TODO improve this
// For one it has infinite scrolling

const BASE_URL = 'http://www.roundhouse.org.uk';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(
    `${BASE_URL}/whats-on/list?categories%5B11%5D=11&categories%5B54%5D=54&categories%5B61%5D=61&categories%5B103%5D=103&categories%5B108%5D=108&categories%5B124%5D=124&categories%5B131%5D=131&categories%5B133%5D=133`
  );

  $(
    "#primary-content article:has(a:contains('Find Tickets')) a:has(img)"
  ).each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('#container h1').html();

  const data = [
    $('#container article').html(),
    $('#page-content article').html(),
  ];

  return { title, data };
});
