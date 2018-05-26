'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.barthacontemporary.com';

exports.pageFinder = co.wrap(function*() {
  let result = [];
  let $ = yield pageLoader(BASE_URL + '/exhibitions/');

  $('#current_exhibitions + article a').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  $('#upcoming_exhibitions  + article a').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result.map(x => (x.endsWith('/') ? x : x + '/'));
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = [$('article .info-list').html(), $('.description').html()];
  return { title, data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact/');
  return $('body > .container').html();
});
