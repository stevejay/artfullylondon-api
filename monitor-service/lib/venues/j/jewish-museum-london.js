'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.jewishmuseum.org.uk';

module.exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/exhibitions');
  const result = [];

  $('#content1 .events a.event').each(function() {
    let href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result.slice(0, 12);
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('#contentarea .page_subtitle').html();
  const data = $('#contentarea').html();
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/Plan_your_visit');
  return $('.listing:has(h3:contains("Plan Your Visit"))').html();
});
