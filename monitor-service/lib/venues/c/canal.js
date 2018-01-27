'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

module.exports.pageParser = co.wrap(function*() {
  const $ = yield pageLoader('http://www.canalprojects.info/gallery.php');
  const data = $('#sliderText').html();
  return { data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader('http://www.canalprojects.info/contact.php');
  return $('#aboutRight').html();
});