'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

module.exports.pageParser = co.wrap(function*() {
  let $ = yield pageLoader('http://lycheeone.com/wp/exhibitions/');
  const data = [$('#content article').html()];

  $ = yield pageLoader('http://lycheeone.com/wp/exhibitions/forthcoming/');
  data.push($('#content article').html());

  return { data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader('http://lycheeone.com/wp/contact/');
  return $('article .entry-content').html();
});
