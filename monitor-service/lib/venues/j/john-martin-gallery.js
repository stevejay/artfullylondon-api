'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.jmlondon.com';

module.exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/exhibitions/');
  const result = [];

  $('.content__exhibitions a').each(function() {
    let href = $(this).attr('href');

    if (href.startsWith('/exhibitions/')) {
      result.push(BASE_URL + href);
    }
  });

  return result.slice(0, 6);
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('.exhibitions__content').html();
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact/');
  return $('main').html();
});
