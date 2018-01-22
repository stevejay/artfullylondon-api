'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://shoreditchtownhall.com';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  let $ = yield pageLoader(`${BASE_URL}/theatre-performance/whats-on`);

  while (true) {
    $('article.listing-item a:has(img)').each(function() {
      const href = $(this).attr('href');
      result.push(href);
    });

    const nextUrl = $(".pagination a:contains('Next')").first().attr('href');

    if (nextUrl) {
      $ = yield pageLoader(nextUrl);
    } else {
      break;
    }
  }

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('#pagecontent h1').html();
  const data = $('#pagecontent').html();
  return { title, data };
});
