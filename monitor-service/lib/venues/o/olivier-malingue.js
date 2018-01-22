'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://oliviermalingue.com';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/exhibitions/`);

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

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1').html();
  const data = [$('.subtitle_date').html(), $('.description').html()];
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact/');
  return $('#content_module').html();
});
