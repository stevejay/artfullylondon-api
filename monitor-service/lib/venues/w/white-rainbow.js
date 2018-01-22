'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

module.exports.pageParser = co.wrap(function*() {
  const data = [];

  let $ = yield pageLoader('http://white-rainbow.co.uk/exhibition/current/');
  data.push($('.entry-header').html());

  $ = yield pageLoader('http://white-rainbow.co.uk/exhibition/future/');
  data.push($('#content article').html());

  return { data };
});
