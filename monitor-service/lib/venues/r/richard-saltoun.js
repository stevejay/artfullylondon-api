'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.richardsaltoun.com';

// TODO check all the exhibitions-grid-xxx sites again to see if
// needs # or . before the names

exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/exhibitions/`);

  function hrefCallback() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  }

  $('.exhibitions-grid-current li a:has(img)').each(hrefCallback);
  $('.exhibitions-grid-current_featured li a:has(img)').each(hrefCallback);
  $('.exhibitions-grid-forthcoming li a:has(img)').each(hrefCallback);
  $('.exhibitions-grid-forthcoming_featured li a:has(img)').each(hrefCallback);

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('#main_content h1').html();
  const data = [$('#main_content .exhibition').html()];
  return { title, data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact/');
  return $('#content').html();
});
