'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

module.exports.pageFinder = co.wrap(function*() {
  return [
    'http://www.geffrye-museum.org.uk/whatson/exhibitions-and-displays/',
    'http://www.geffrye-museum.org.uk/whatson/future/',
  ];
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('.contentMain').html();
  return { title, data };
});
