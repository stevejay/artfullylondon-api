'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.residence-gallery.com';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/exhibitions.htm`);

  $('#div1 h3 > a').each(function() {
    const href = $(this).attr('href');

    if (href.startsWith('exhibitions/')) {
      result.push(BASE_URL + '/' + href);
    }
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('#div1').html();
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/about.htm');
  return $('#div1 table').html();
});
