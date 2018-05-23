'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = co.wrap(function*() {
  const $ = yield pageLoader('http://www.espaciogallery.com/');
  const data = $('h2 + .paragraph').html();
  return { data };
});
