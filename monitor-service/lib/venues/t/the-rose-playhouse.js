'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.roseplayhouse.org.uk';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/experience/events/`);

  $('.event_title h3 > a').each(function() {
    const href = $(this).attr('href');

    if (href.includes('/events/')) {
      result.push(href);
    }
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('#page_title').html();
  const data = [$('#event_info').html(), $('#event_detail').html()];
  return { title, data };
});
