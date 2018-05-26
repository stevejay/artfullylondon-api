'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.carrollfletcher.com';

exports.pageFinder = co.wrap(function*() {
  const result = [];

  function hrefCallback() {
    const href = $(this).attr('href');
    result.push(BASE_URL + '/' + href);
  }

  let $ = yield pageLoader(BASE_URL + '/exhibitions/current/');
  $('#exhibitions-grid-current a:has(img)').each(hrefCallback);
  $('#exhibitions-grid-current_featured a:has(img)').each(hrefCallback);

  $ = yield pageLoader(BASE_URL + '/exhibitions/forthcoming/');
  $('#exhibitions-grid-forthcoming a:has(img)').each(hrefCallback);
  $('#exhibitions-grid-forthcoming_featured a:has(img)').each(hrefCallback);

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('#main_content').html();
  return { title, data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact/');
  return $('#content #content_module').html();
});
