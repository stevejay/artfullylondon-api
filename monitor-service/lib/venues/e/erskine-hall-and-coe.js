'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.erskinehallcoe.com';

module.exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/exhibitions/');
  const result = [];

  $('main > section a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('.c-exhibition-index__text').html();
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact/');
  return $('#main .c-contactpage__address').html();
});
