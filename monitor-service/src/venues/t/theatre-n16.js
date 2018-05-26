'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').spaLoader;

const BASE_URL = 'http://www.theatren16.co.uk';

exports.pageUrlChunks = 2;

exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/what-s-on`, 'a');

  $('a:contains(\'MORE INFO\')').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  return { title: pageUrl, data: pageUrl };

  // Timeout problem.

  // const $ = yield pageLoader(pageUrl);
  // const title = $('#SITE_PAGES h3').html();
  // const data = $('#SITE_PAGES').html();
  // return { title, data };
});
