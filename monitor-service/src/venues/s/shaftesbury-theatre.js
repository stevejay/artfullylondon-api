'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.shaftesburytheatre.com';

exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/`);

  $('#mainBg a:has(img)').each(function() {
    const href = $(this).attr('href');

    if (/\/shows\/./.test(href)) {
      result.push(href);
    }
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = [$('#lowerContent').html()];
  return { title, data };
});
