'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.nhm.ac.uk';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/visit/exhibitions.html`);

  $('.main-section a:has(img)').each(function() {
    const href = $(this).attr('href');

    if (href.startsWith('/visit/exhibitions/')) {
      result.push(BASE_URL + href);
    }
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('.main-section h1').html();

  const data = $('.main-section p').each(function() {
    $(this).html();
  });

  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/visit/getting-here.html');

  return $('.info-sidebar').each(function() {
    $(this).html();
  });
});
