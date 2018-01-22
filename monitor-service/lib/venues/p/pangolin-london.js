'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.pangolinlondon.com';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];

  let $ = yield pageLoader(`${BASE_URL}/exhibitions/current`);
  $('ul.exhibitions li a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  $ = yield pageLoader(`${BASE_URL}/exhibitions/future`);
  $('ul.exhibitions li a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('.title h2').html();

  const data = [
    $('#content .title').html(),
    $('#content .exhibition-info').html(),
    $('#content .description').html(),
  ];

  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL);
  return $('.opening-hours').html();
});
