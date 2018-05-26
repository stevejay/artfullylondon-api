'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://galleryfumi.com';

exports.pageFinder = co.wrap(function*() {
  const result = [];

  let $ = yield pageLoader(BASE_URL + '/exhibitions/');
  $('section.section--exhibitions a:has(h4)').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  $ = yield pageLoader(BASE_URL + '/exhibitions/future/');
  $('section.section--exhibitions a.exhibition-item').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('.section-header h2').html();

  const data = [
    $('.section-header p').html(),
    $('section.section--exhibition-details').html(),
  ];

  return { title, data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact/');
  return $('section.fumi-location').html();
});
