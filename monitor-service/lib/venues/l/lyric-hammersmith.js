'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://lyric.co.uk';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];

  const categories = ['main-house', 'studio', 'amici-in-rep', 'little-lyric'];

  for (let i = 0; i < categories.length; ++i) {
    const $ = yield pageLoader(`${BASE_URL}/shows/category/${categories[i]}/`);

    $('.listing a:has(img)').each(function() {
      const href = $(this).attr('href');
      result.push(href);
    });
  }

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('#content-area h1').html();
  const data = $('#content-area article section').html();
  return { title, data };
});
