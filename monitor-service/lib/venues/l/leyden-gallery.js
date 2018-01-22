'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://leydengallery.com';

module.exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/');
  const result = [];

  $('a:contains("current exhibition")').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  $('a:contains("upcoming exhibition")').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('#page-title').html();
  const data = $('#main-content section').html();
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact');
  return $('section.contact').html();
});
