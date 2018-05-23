'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.southlondongallery.org';

exports.pageFinder = co.wrap(function*() {
  const result = [];

  const categories = ['exhibitions', 'talks-events', 'children-families'];

  for (let i = 0; i < categories.length; ++i) {
    const $ = yield pageLoader(`${BASE_URL}/page/${categories[i]}`);

    $('#records a:has(img)').each(function() {
      const href = $(this).attr('href');
      result.push(BASE_URL + href);
    });
  }

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = [$('#contentInner .copy').html()];
  return { title, data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/page/visit');
  return $('#contentInner').html();
});
