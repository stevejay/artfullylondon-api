'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.lazinc.com';

module.exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/exhibitions');
  const result = [];

  $('#body a:has(img)').each(function() {
    const href = $(this).attr('href');

    if (href.includes('/exhibitions/')) {
      result.push(href);
    }
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('#body h1').html();
  const data = $('#exhibition').html();
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact');
  return $('#lazarides-rathbone').html();
});
