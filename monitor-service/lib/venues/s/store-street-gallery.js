'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').spaLoader;

module.exports.pageParser = co.wrap(function*() {
  let $ = yield pageLoader('http://www.storestreetgallery.com/exhibitions/');
  const data = $('.sidearea').html();
  return { data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader('http://www.storestreetgallery.com/contact/');
  return $('#contact-details').html();
});