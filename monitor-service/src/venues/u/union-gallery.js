'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.union-gallery.com';

exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/content.php?page_id=575`);

  $('a:contains(\'more\')').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + '/' + href);
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('#content h1').html();
  const data = $('#content').html();
  return { title, data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/content.php?page_id=580');
  return $('#content').html();
});
