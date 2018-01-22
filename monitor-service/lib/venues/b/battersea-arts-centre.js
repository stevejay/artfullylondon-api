'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.bac.org.uk';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];

  const $ = yield pageLoader(
    BASE_URL + '/content_category/3262/whats_on/whats_on'
  );

  $('a:has(img)').each(function() {
    const href = $(this).attr('href');

    if (href.startsWith('/events/')) {
      result.push(BASE_URL + href);
    }
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();

  const data = $(
    'body > .container .row:first-of-type .col-sm-8:first-of-type'
  ).html();

  return { title, data };
});
