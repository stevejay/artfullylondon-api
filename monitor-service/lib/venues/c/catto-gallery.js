'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://cattogallery.co.uk';

module.exports.pageParser = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/exhibitions/');

  const data = $(
    'h2:contains("Forthcoming Exhibitions") ~ div'
  ).each(function() {
    $(this).html();
  });

  return { data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact/');

  return $('.page-content .row .content p:first-of-type')
    .nextUntil('hr')
    .each(function() {
      $(this).html();
    });
});
