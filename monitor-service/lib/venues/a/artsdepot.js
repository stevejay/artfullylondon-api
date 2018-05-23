'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.artsdepot.co.uk';

exports.pageFinder = co.wrap(function*() {
  const result = [];
  const categories = [1, 3, 4, 261];

  for (let i = 0; i < categories.length; ++i) {
    const $ = yield pageLoader(
      `${BASE_URL}/whats-on?field_event_type_tid%5B%5D=${i}`
    );

    $('.listings a:has(img)').each(function() {
      const href = $(this).attr('href');
      result.push(BASE_URL + href);
    });
  }

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('.mainContent h1').html();

  const data = [
    $('.mainContent').html(),
    $('.booking-info').html(),
    $('.ticket-list').html(),
  ];

  return { title, data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/opening-hours');
  return $('.mainContent').each(() => $(this).html());
});
