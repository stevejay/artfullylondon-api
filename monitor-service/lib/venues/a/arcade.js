'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

module.exports.pageParser = co.wrap(function*() {
  const $ = yield pageLoader('http://arcadefinearts.com/exhibitions/current');
  const data = $('article').html();
  return { data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader('http://arcadefinearts.com/gallery');
  return $('#gallery-details').html();
});
