'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.upstairsatthegatehouse.com';

exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/`);

  $('#menu-gatehouse > li:first-of-type a').each(function() {
    const href = $(this).attr('href');

    if (href && href.startsWith(BASE_URL)) {
      result.push(href);
    }
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('.entry-content').html();
  return { title, data };
});
