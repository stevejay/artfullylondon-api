'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.hampsteadtheatre.com';

exports.pageFinder = co.wrap(function*() {
  const result = [];

  let $ = yield pageLoader(BASE_URL + '/whats-on/main-stage/');
  $('.prodlist__buttons > a').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  $ = yield pageLoader(BASE_URL + '/whats-on/hampstead-downstairs/');
  $('.prodlist__buttons > a').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1.production-intro__title').html();

  const data = [
    $('.production-intro').html(),
    $('#details').html(),
    $('.timetables').html(),
  ];

  return { title, data };
});
