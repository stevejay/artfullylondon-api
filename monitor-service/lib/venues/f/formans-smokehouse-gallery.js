'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://smokehousegallery.org/';

module.exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL);
  const result = [];

  $('.post h2 > a').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result.slice(0, 4);
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h2.title').html();
  const data = $('#content .post').html();
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/visit/');
  return $('#content').html();
});
