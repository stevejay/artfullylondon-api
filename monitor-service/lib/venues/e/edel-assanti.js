'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = co.wrap(function*() {
  const $ = yield pageLoader('http://edelassanti.com/exhibitions/');
  const data = $('.exhibition-header').html();
  return { data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader('http://edelassanti.com/contact/');
  return $('#content #content_module').html();
});
