'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.blainsouthern.com';

exports.pageFinder = co.wrap(function*() {
  const result = [];
  let $ = yield pageLoader(BASE_URL + '/exhibitions');

  $(
    'li.exhibition:has(.gallery_title:contains("London")) a:has(img)'
  ).each(function() {
    let href = $(this).attr('href');
    result.push(href);
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('#center').html();
  return { title, data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/gallery-info');

  return $('#content #center p').each(function() {
    $(this).html();
  });
});
