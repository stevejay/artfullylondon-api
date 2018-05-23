'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://londoncoliseum.org';

exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/');
  const result = [];

  $('#now > a').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  $('#coming a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('#top').html();
  return { title, data };
});
