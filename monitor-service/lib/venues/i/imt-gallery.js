'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

module.exports.pageParser = co.wrap(function*() {
  const $ = yield pageLoader('http://www.imagemusictext.com/next');
  const data = $('.entry-content').html();
  return { data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader('http://www.imagemusictext.com/contact');
  return $('#main .entry-content').html();
});
