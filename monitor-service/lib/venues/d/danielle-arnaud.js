'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.daniellearnaud.com';

module.exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/exhibitions/exhibitions-index.html');
  const result = [];

  $('#content p a').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result.slice(0, 4);
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();

  const data = $('#content table tr p').each(function() {
    $(this).html();
  });

  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact/contact-index.html');
  return $('#content0').html();
});
