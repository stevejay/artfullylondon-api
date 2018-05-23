'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.mattsgallery.org';

exports.pageFinder = co.wrap(function*() {
  const result = [];

  const $ = yield pageLoader(
    `${BASE_URL}/exhibitions/${new Date().getFullYear()}.php/`
  );

  $('a.artistlink').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href.replace(/^\.\.\//, '/'));
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = [$('.maintable').html()];

  $('.contenttable p').each(function() {
    data.push($(this).html());
  });

  return { title, data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL);
  return $('.spacemenu:contains("Founded in 1979")').html();
});
