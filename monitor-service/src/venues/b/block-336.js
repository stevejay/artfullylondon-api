'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://block336.com';

exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(BASE_URL + '/exhibitions/');

  $('#wrapper div[gg-link]').each(function() {
    let href = $(this).attr('gg-link');
    result.push(href);
  });

  return result.slice(0, 4);
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();

  const data = $('.justifytext p').each(function() {
    $(this).html();
  });

  return { title, data };
});
