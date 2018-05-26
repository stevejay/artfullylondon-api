'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://letrangere.net';

exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(BASE_URL + '/exhibitions/');

  $('.exhibitions a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result.slice(0, 4);
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('.general_posts_details h1').html();
  const data = $('.general_posts_details').html();
  return { title, data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact/');
  return $('#content .contact_details').html();
});
