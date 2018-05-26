'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = co.wrap(function*() {
  let $ = yield pageLoader('http://curiousdukegallery.com/exhibitions/current');
  const data = [$('article').html()];

  $ = yield pageLoader('http://curiousdukegallery.com/exhibitions/future');
  data.push($('article').html());

  return { data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader('http://curiousdukegallery.com/contact');
  return $('.container .menu-col').html();
});
