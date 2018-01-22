'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://cubittartists.org.uk';

module.exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(
    BASE_URL + '/category/gallery/gallery-exhibitions/'
  );
  const result = [];

  $('#excerpts h2 a').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result.slice(0, 6);
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1 a').html();

  const data = $('#content p').each(function() {
    $(this).html();
  });

  return { title, data };
});
