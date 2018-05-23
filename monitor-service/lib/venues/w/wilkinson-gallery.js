'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = co.wrap(function*() {
  const data = [];

  let $ = yield pageLoader('http://www.wilkinsongallery.com/');
  data.push($('#container .right-col').html());

  return { data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader('http://www.wilkinsongallery.com/');
  return $('#container .section.left-col').html();
});
