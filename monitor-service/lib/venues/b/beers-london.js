'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://beerslondon.com';

module.exports.pageFinder = co.wrap(function*() {
  let result = [];
  let $ = yield pageLoader(BASE_URL + '/exhibitions');

  $('#main .img a').each(function() {
    let href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('#about').html();
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact-us');
  return $('#contactwrapper').html();
});
