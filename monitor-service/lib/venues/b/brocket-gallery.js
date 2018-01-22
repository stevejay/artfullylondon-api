'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.brocketgallery.com';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(BASE_URL + '/');

  $('.index-collection:first-of-type ul li a').each(function() {
    const href = $(this).attr('href');

    if (href !== '/archive/') {
      result.push(BASE_URL + href);
    }
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('.image-detail-wrapper').html();
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact-1/');

  return $('#mainContent p').each(function() {
    $(this).html();
  });
});
