'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.oldvictheatre.com';

exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(`${BASE_URL}/whats-on`);
  const result = [];

  $('a:contains("View More")').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('main').html();
  return { title, data };
});
