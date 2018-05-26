'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.cobgallery.com';

exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(`${BASE_URL}/exhibitions/`);
  const result = [];

  function hrefCallback() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  }

  $('#exhibitions-grid-current a:has(img)').each(hrefCallback);
  $('#exhibitions-grid-current_featured a:has(img)').each(hrefCallback);
  $('#exhibitions-grid-forthcoming a:has(img)').each(hrefCallback);
  $('#exhibitions-grid-forthcoming_featured a:has(img)').each(hrefCallback);

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('#main_content .exhibition h1').html();
  const data = $('#main_content .exhibition').html();
  return { title, data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact/');
  return $('#content_module').html();
});
