'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.tristanbatestheatre.co.uk';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/whats-on`);

  $('article figure a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('#item h1').html();
  const data = $('#item').html();
  return { title, data };
});
