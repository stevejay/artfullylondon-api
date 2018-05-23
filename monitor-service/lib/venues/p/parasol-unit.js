'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = co.wrap(function*() {
  const data = [];

  let $ = yield pageLoader('http://www.parasol-unit.org/current');
  data.push($('#content').html());

  $ = yield pageLoader('http://www.parasol-unit.org/upcoming-exhibitions');
  data.push($('#content').html());

  return { data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader('http://www.parasol-unit.org');
  return $('#footer > .copy').html();
});
