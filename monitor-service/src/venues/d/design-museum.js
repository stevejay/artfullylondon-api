'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://designmuseum.org';

exports.pageFinder = co.wrap(function*() {
  const result = [];

  let $ = yield pageLoader(BASE_URL + '/exhibitions');
  $(
    '.page-components section.row:first-of-type .page-item > a:has(figure)'
  ).each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  $ = yield pageLoader(BASE_URL + '/exhibitions/future-exhibitions');
  $(
    '.page-components section.row:first-of-type .page-item > a:has(figure)'
  ).each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1').html();

  const data = $('.component-content').each(function() {
    $(this).html();
  });

  return { title, data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(
    BASE_URL + '/plan-your-visit/redirect-times-and-prices'
  );

  return $('.page-components').html();
});
