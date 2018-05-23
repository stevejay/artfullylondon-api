'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = co.wrap(function*() {
  const data = [];

  const $ = yield pageLoader('http://twotempleplace.org/exhibitions/');
  data.push($('h1 + div').html());

  return { data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader('http://twotempleplace.org/visit/hours/');
  return $('.col1.col').html();
});
