'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.stolenspace.com';

exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/exhibitions/`);

  $('.content a:contains(\'VIEW\')').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  $('.content a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result.slice(0, 5);
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('.content h1').html();

  const data = [
    $('.portfolio_single .grid_section').html(),
    $('.gallery-main-title').html(),
  ];

  return { title, data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact/');
  return $('.content .content_inner').html();
});
