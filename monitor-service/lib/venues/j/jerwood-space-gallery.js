'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.jerwoodvisualarts.org';

module.exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/events/');
  const result = [];

  $('#main-listing li > a:has(img)').each(function() {
    let href = $(this).attr('href');

    if (!href.startsWith('http')) {
      href = BASE_URL + href;
    }

    result.push(href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1').html();
  const data = [$('.venue-details').html(), $('.entry-content').html()];
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/jerwood-space-visitor-information/');
  return $('.page').html();
});
