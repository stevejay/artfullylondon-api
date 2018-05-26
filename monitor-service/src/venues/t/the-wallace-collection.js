'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.wallacecollection.org';

exports.pageUrlChunks = 1;

exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/whatson/exhibitions`);

  $('#exhibitions h2 > a').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('#overview h1').html();
  const data = $('#overview').html();
  return { title, data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/visiting');
  return $('#content').html();
});
