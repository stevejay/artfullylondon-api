'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.artfirst.co.uk';

exports.pageFinder = co.wrap(function*() {
  const result = [];

  const $ = yield pageLoader(BASE_URL + '/index.html');

  $('#current a').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('#content').html();
  return { title, data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader('http://www.artfirst.co.uk/about_us.html');
  return $('#content').html();
});
