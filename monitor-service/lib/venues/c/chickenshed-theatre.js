'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.chickenshed.org.uk';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];

  for (let i = 0; i < 3; ++i) {
    const $ = yield pageLoader(BASE_URL + '/whats-on?page=' + i);

    $(
      '.listings li:has(p.venue:contains("Chickenshed")) a:has(img)'
    ).each(function() {
      const href = $(this).attr('href');
      result.push(BASE_URL + href);
    });
  }

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('.mainContent').html();
  return { title, data };
});
