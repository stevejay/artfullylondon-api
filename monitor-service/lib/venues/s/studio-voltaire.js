'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

module.exports.pageParser = co.wrap(function*() {
  const data = [];

  let $ = yield pageLoader('http://www.studiovoltaire.org/exhibitions/');
  data.push($('.fullWidthContainer:has(h1)').html());

  $ = yield pageLoader(
    'http://www.studiovoltaire.org/exhibitions/forthcoming/'
  );

  data.push($('.fullWidthContainer:has(h1)').html());

  return { data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader('http://www.studiovoltaire.org/visit/');
  return $('#gmap + div').html();
});
