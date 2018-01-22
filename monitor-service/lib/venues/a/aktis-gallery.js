'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://aktis-gallery.co.uk';

module.exports.minimumExpectedEvents = 0;

module.exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/exhibitions/');
  const result = [];

  function hrefCallback() {
    const href = BASE_URL + $(this).attr('href');
    result.push(href);
  }

  $('#exhibitions-grid-current a:has(img)').each(hrefCallback);
  $('#exhibitions-grid-current_featured a:has(img)').each(hrefCallback);
  $('#exhibitions-grid-forthcoming a').each(hrefCallback);
  $('#exhibitions-grid-forthcoming_featured a').each(hrefCallback);

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('#main_content').html();
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact/');
  return $('#content_module p').each(() => $(this).html());
});
