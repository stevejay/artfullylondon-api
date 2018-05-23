'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.ovalhouse.com';

exports.pageFinder = co.wrap(function*() {
  const result = [];
  const pages = ['P1', 'P12'];

  for (var i = 0; i < 2; ++i) {
    const $ = yield pageLoader(`${BASE_URL}/whatson/${pages[i]}/`);

    $('figure a:has(img)').each(function() {
      const href = $(this).attr('href');
      result.push(href);
    });
  }

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('#info header h1').html();
  const data = $('#info').html();
  return { title, data };
});
