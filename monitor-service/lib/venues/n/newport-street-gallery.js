'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = co.wrap(function*() {
  let $ = yield pageLoader(
    'http://www.newportstreetgallery.com/exhibitions/current'
  );

  const data = [];

  data.push($('.exhibition-current .intro-inner').html());
  data.push($('.exhibition-current .desc').html());

  $ = yield pageLoader(
    'http://www.newportstreetgallery.com/exhibitions/forthcoming'
  );

  data.push($('.exhibition-forthcoming .intro-inner').html());
  data.push($('.exhibition-forthcoming .desc').html());

  return { data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader('http://www.newportstreetgallery.com/visit');
  return $('#visit').html();
});
