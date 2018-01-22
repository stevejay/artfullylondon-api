'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.estorickcollection.com';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];

  let $ = yield pageLoader(BASE_URL + '/events');
  $('.u-space--mb-s a').each(function() {
    const href = $(this).attr('href');

    if (href.startsWith('/events/')) {
      result.push(BASE_URL + href);
    }
  });

  $ = yield pageLoader(BASE_URL + '/exhibitions/in-the/future');
  $('.u-space--mb-s a').each(function() {
    const href = $(this).attr('href');

    if (href.startsWith('/exhibitions/')) {
      result.push(BASE_URL + href);
    }
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('main p').html();
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/visitor-information');
  return $('main h3:contains("Opening Times") + p').html();
});
