'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

// Note: arebyte have updated their website but they don't seem to have
// any proper event info.

const BASE_URL = 'http://www.arebyte.com';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  let $ = yield pageLoader(`${BASE_URL}`);

  $("li.menuItem li.subMenuItem a:contains('current')").each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const data = $('.page_current_2.title').html();
  return { data };
});
