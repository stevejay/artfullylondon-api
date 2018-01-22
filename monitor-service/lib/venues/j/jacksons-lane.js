'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.jacksonslane.org.uk';

module.exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/whats-on');
  const result = [];

  $('.event a:has(h2)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('.title > h2').html();

  const data = [
    $('main.main--event-detail .title').html(),
    $('main.main--event-detail .m-article').html(),
  ];

  return { title, data };
});
