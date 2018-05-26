'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.grad-london.com';

exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/whatson/');
  const result = [];

  $('.top-down-container p a').each(function() {
    const href = $(this).attr('href');

    if (href.startsWith('/whatson/')) {
      result.push(BASE_URL + href);
    }
  });

  return result.slice(0, 5);
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('.block-text h3').html();
  const data = $('.block-text').html();
  return { title, data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/visit/');
  return $('.main .block-center').html();
});
