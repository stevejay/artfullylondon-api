'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.timothytaylor.com';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/exhibitions/`);

  $('main a:has(img)').each(function() {
    const href = $(this).attr('href');

    if (href.startsWith('/exhibitions/')) {
      result.push(BASE_URL + href);
    }
  });

  return result.slice(0, 6);
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('.eventinfo--container').html();
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact/');
  return $('.contact__section').html();
});
