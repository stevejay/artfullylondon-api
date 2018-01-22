'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

module.exports.pageParser = co.wrap(function*() {
  const $ = yield pageLoader(
    'http://www.emmahilleagle.com/exhibitions/current-exhibition/'
  );

  const data = $('article').html();
  return { data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader('http://www.emmahilleagle.com/contact/');
  return $('#primary #content .entry-content').html();
});
