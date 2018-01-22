'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.thecockpit.org.uk';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];

  let $ = yield pageLoader(`${BASE_URL}/`);
  $('#block-system-main .view-content a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  $ = yield pageLoader(`${BASE_URL}/taxonomy/term/20`);
  $(
    '#block-views-ud-upcoming-shows-block-5 .view-content a:has(img)'
  ).each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('#page-title').html();
  const data = $('#main').html();
  return { title, data };
});
