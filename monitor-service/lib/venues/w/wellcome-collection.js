'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://wellcomecollection.org';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const categories = ['exhibitions/all-exhibitions', 'events/all-events'];

  for (let i = 0; i < categories.length; ++i) {
    const $ = yield pageLoader(`${BASE_URL}/whats-on/${categories[i]}`);

    $('.main-content article h2 a').each(function() {
      const href = $(this).attr('href');
      result.push(BASE_URL + href);
    });
  }

  const $ = yield pageLoader(`${BASE_URL}/youth-and-schools-events`);

  $(
    ".main-content article:has(.snippet__booking:contains('Drop in')) h2 a"
  ).each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('.main-content h1').html();
  const data = $('.main-content').html();
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/visit-us/opening-hours');
  return $('.main-content').html();
});
