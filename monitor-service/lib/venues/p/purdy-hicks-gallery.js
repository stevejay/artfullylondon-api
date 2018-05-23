'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = co.wrap(function*() {
  let $ = yield pageLoader('http://www.purdyhicks.com/exhibitions.php?opt=c');
  const data = [$('#mainContent').html()];

  $ = yield pageLoader('http://www.purdyhicks.com/exhibitions.php?opt=f');
  data.push($('#mainContent').html());

  return { data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader('http://www.purdyhicks.com/contact.php');
  return $('#text').html();
});
