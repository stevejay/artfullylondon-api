'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

module.exports.pageParser = co.wrap(function*() {
  const $ = yield pageLoader('http://www.cellprojects.org/exhibitions/future');
  const data = $('#main-container ul li article').html();
  return { data };
});
