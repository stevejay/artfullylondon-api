'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://bethlemgallery.com';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  let $ = yield pageLoader(BASE_URL + '/whats-on/');

  $('#main .type-event a').each(function() {
    let href = $(this).attr('href');
    result.push(href.startsWith(BASE_URL) ? href : BASE_URL + '/' + href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('#content article').html();
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/location/');
  return $('section.entry-content').html();
});
