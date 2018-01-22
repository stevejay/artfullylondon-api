'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

module.exports.pageParser = co.wrap(function*() {
  const $ = yield pageLoader('http://www.houldsworth.co.uk/exhibitions');
  const data = $('#site_navigation_03').html();
  return { data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader('http://www.houldsworth.co.uk/contact');
  return $('#site_main_content').html();
});
