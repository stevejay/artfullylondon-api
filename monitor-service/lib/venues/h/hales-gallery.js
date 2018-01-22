'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.halesgallery.com';

module.exports.pageParser = co.wrap(function*() {
  const data = [];

  let $ = yield pageLoader('http://www.halesgallery.com/exhibitions/current/');
  data.push($('#content').html());

  $ = yield pageLoader('http://www.halesgallery.com/exhibitions/forthcoming/');
  data.push($('#content').html());

  return { data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/about/contact/');
  return $('#location1').html();
});
