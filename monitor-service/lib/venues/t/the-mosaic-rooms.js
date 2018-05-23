'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://mosaicrooms.org';

exports.pageFinder = co.wrap(function*() {
  const result = [];
  const categories = ['exhibitions', 'talks-and-events'];

  for (let i = 0; i < categories.length; ++i) {
    const $ = yield pageLoader(`${BASE_URL}/events/category/${categories[i]}/`);

    $('.tribe-events-loop a:has(img)').each(function() {
      const href = $(this).attr('href');
      result.push(href);
    });
  }

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1.h1').html();

  const data = [
    $('h1.h1').html(),
    $('h1.h1 + h2').html(),
    $('.tribe-events-schedule').html(),
    $('#tribe-events-content .description').html(),
  ];

  return { title, data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/visit-us/');
  return $('main article').html();
});
