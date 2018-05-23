'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.furtherfield.org';

exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/programmes/exhibitions');
  const result = [];

  $('.node a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result.slice(0, 3);
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('#main .content').html();
  return { title, data };
});
