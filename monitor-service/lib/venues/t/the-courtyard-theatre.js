'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.thecourtyard.org.uk';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];

  const $ = yield pageLoader(`${BASE_URL}/whatson/`);
  $('#content .newsitem a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('#middle h2').html();
  const data = $('#middle').html();
  return { title, data };
});
