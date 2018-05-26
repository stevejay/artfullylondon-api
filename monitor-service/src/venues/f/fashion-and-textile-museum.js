'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.ftmlondon.org';

exports.pageFinder = co.wrap(function*() {
  const result = [];

  let $ = yield pageLoader(BASE_URL + '/whats-on/exhibitions-and-displays/');
  $('article .press-office a:has(img)').each(function() {
    const href = $(this).attr('href');

    if (href.includes('/ftm-exhibitions/')) {
      result.push(href);
    }
  });

  $ = yield pageLoader(BASE_URL + '/whats-on/talks-and-events/');
  $('h4 > a').each(function() {
    const href = $(this).attr('href');

    if (href.includes('/ftm-whats-on/')) {
      result.push(href);
    }
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1').html();

  const data = $('article section p').each(function() {
    $(this).html();
  });

  return { title, data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/visit-ftm/map-and-directions/');
  return $('#sidebar').html();
});
