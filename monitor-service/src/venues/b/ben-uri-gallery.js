'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://benuri.org.uk';

exports.pageFinder = co.wrap(function*() {
  let result = [];
  let $ = yield pageLoader(BASE_URL + '/exhibitions/');

  $('aside h4 a').each(function() {
    let href = $(this).attr('href');
    result.push(href);
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('.tribe-events-single-section').html();
  return { title, data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/about-us/your-visit/');
  return $('main.content').html();
});
