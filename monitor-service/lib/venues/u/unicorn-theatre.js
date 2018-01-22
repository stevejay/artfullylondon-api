'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.unicorntheatre.com';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/whatson`);

  $('li.production a').each(function() {
    const href = $(this).attr('href');

    if (href) {
      result.push(BASE_URL + href);
    }
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = [$('#location').html(), $('#maincontent').html()];
  return { title, data };
});
