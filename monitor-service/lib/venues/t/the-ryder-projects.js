'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = co.wrap(function*() {
  const $ = yield pageLoader(
    'http://www.theryderprojects.com/exhibitions.html'
  );

  const data = $('#content-wrapper').html();
  return { data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader('http://www.theryderprojects.com/contact.html');
  return $('#wsite-content').html();
});
