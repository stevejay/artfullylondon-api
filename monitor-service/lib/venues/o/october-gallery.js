'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.octobergallery.co.uk';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/exhibitions/`);

  $('.events_box a:has(img)').each(function() {
    const href = $(this).attr('href');

    if (href.startsWith('/exhibitions/') && href.endsWith('/index.shtml')) {
      result.push(BASE_URL + href);
    }
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('.event_content h2').html();
  const data = $('.event_content').html();
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact/');
  return $('.home_main_container .right_column_object').html();
});
