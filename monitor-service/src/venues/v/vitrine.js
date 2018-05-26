'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.vitrinegallery.com';

exports.pageFinder = co.wrap(function*() {
  const result = [];

  let $ = yield pageLoader(`${BASE_URL}/exhibitions/`);
  $('#exhib-list a:has(img)').each(function() {
    const href = $(this).attr('href');

    if (href && href.includes('/exhibitions/')) {
      result.push(href);
    }
  });

  $ = yield pageLoader(`${BASE_URL}/future-exhibitions/`);
  $('#exhib-list a:has(img)').each(function() {
    const href = $(this).attr('href');

    if (href && href.includes('/exhibitions/')) {
      result.push(href);
    }
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('#main-wrapper h1').html();
  const data = $('#main-wrapper').html();
  return { title, data };
});
