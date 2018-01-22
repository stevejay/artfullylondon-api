'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.hanmigallery.co.uk';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];

  let $ = yield pageLoader(BASE_URL + '/exhibitions/current/');
  $('#content ul li.links a:contains("Press Release")').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  $ = yield pageLoader(BASE_URL + '/exhibitions/future/');
  $('#content ul li.links a:contains("Press Release")').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('#content h2').html();
  const data = $('#content_area').html();
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact/london/');
  return $('#content_area').html();
});
