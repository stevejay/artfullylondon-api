'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.bushtheatre.co.uk';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(BASE_URL + '/whats-on/');

  $('main a').each(function() {
    const href = $(this).attr('href');

    if (href.includes('/event/')) {
      result.push(href);
    }
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('main #anchor-details').html();
  return { title, data };
});
