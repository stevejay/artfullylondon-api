'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.sohotheatre.com';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];

  const categories = [
    'cabaret',
    'theatre',
    'dance',
    'opera',
    'spoken-word',
    'talks',
  ];

  for (let i = 0; i < categories.length; ++i) {
    const $ = yield pageLoader(
      `${BASE_URL}/whats-on/?category=${categories[i]}`
    );

    if ($('#unit-event-list .no-events').length > 0) {
      continue;
    }

    $('#unit-event-list .event a:has(img)').each(function() {
      const href = $(this).attr('href');
      result.push(BASE_URL + href);
    });
  }

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();

  const data = [
    $('#unit-production-header').html(),
    $('#primary-content').html(),
  ];

  return { title, data };
});
