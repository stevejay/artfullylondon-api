'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.sadlerswells.com';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];

  let $ = yield pageLoader(`${BASE_URL}/whats-on/list?venues=88`);
  $('.area-production-list .whatsonchunk a:has(img)').each(function() {
    let href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  $ = yield pageLoader(`${BASE_URL}/whats-on/list?venues=109`);
  $('.area-production-list .whatsonchunk a:has(img)').each(function() {
    let href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  let $ = yield pageLoader(pageUrl);
  const title = $('#h2pagetitle').html();
  const data = [$('#showpage_contentarea').html(), $('#perf_rhs').html()];

  $ = yield pageLoader(pageUrl + 'booking');
  $('#perf_lhs_content').each(function() {
    data.push($(this).html());
  });

  return { title, data };
});
