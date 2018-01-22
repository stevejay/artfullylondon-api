'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

module.exports.pageParser = co.wrap(function*() {
  const $ = yield pageLoader('http://www.p3exhibitions.com/future/');
  const data = $('.entryText').html();
  return { data };
});
