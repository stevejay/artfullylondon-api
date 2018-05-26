'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.pilarcorrias.com';

exports.pageFinder = co.wrap(function*() {
  const result = [];

  let $ = yield pageLoader(`${BASE_URL}/exhibitions/?show=current`);
  $('#container article h1 a').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  $ = yield pageLoader(`${BASE_URL}/exhibitions/?show=future`);
  $('#container article h1 a').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('#content h1').html();
  const data = $('#content article header').html();
  return { title, data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact/');

  return $('#content p').each(function() {
    $(this).html();
  });
});
