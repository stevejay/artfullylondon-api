'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://wellhung.co.uk';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/exhibitions/`);

  const callback = function() {
    const href = $(this).attr('href');

    if (href.startsWith('http')) {
      result.push(href);
    }
  };

  $('.next-exhibition a').each(callback);
  $('.future-exhibitions-list a').each(callback);
  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('#main h1').html();
  const data = $('#main').html();
  return { title, data };
});
