'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://thelittleboxoffice.com';

exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(BASE_URL + '/brookside/');

  $('h3 a').each(function() {
    const href = $(this).attr('href');

    if (href.startsWith('/brookside/event/')) {
      result.push(BASE_URL + href);
    }
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('.content-title h1').html();
  const data = $('#section1').html();
  return { title, data };
});
