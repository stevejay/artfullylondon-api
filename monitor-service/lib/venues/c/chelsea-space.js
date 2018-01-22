'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.chelseaspace.org';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];

  let $ = yield pageLoader(BASE_URL + '/index.html');
  $('a:contains("exhibition info")').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + '/' + href);
  });

  $ = yield pageLoader(BASE_URL + '/future.html');
  $('a:contains("exhibition info")').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + '/' + href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1').html();

  const data = $('p').each(function() {
    $(this).html();
  });

  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/visit.html');
  return $('#content-archive-index').html();
});
