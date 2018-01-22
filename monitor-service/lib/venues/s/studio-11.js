'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.studio1-1.co.uk/';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(BASE_URL);

  $('.page-entry-content p a').each(function() {
    const href = $(this).attr('href');

    if (!href.endsWith('.jpeg')) {
      result.push(href);
    }
  });

  return result.slice(0, 5);
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1.entry-title').html();
  const data = $('#content').html();
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + 'contact/');
  return $('#content .page-entry-content').html();
});
