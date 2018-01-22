'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://almeida.co.uk';

module.exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/whats-on');
  const result = [];

  $('.card a').each(function() {
    const href = $(this).attr('href');

    if (href.toLowerCase().includes('/whats-on/')) {
      result.push(BASE_URL + href);
    }
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1').html();

  const data = $('.content-box').each(function() {
    return $(this).html();
  });

  return { title, data };
});
