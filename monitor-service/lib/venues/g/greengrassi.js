'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = co.wrap(function*() {
  const $ = yield pageLoader('http://www.greengrassi.com/Current');
  const title = $('title').html();
  const data = [$('.artist-column').html(), $('.date-column').html()];
  return { title, data };
});
