'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.cptheatre.co.uk';

module.exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/whats-on/');
  const result = [];

  $('main h2 a').each(function() {
    const href = $(this).attr('href');

    if (href.includes('/production/')) {
      result.push(href);
    }
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1').html();

  const data = $('article p').each(function() {
    $(this).html();
  });

  return { title, data };
});
