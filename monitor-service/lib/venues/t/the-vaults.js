'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').spaLoader;

const BASE_URL = 'https://www.thevaults.london';

module.exports.pageUrlChunks = 1;

module.exports.pageFinder = co.wrap(function*() {
  const result = [];

  const $ = yield pageLoader(
    `${BASE_URL}/whats-on`,
    '#PAGES_CONTAINERcenteredContent'
  );

  $('#PAGES_CONTAINERcenteredContent a').each(function() {
    const href = $(this).attr('href');

    if (href && href.startsWith(BASE_URL)) {
      result.push(href);
    }
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('#PAGES_CONTAINERcenteredContent h2').html();
  const data = $('#PAGES_CONTAINERcenteredContent').html();
  return { title, data };
});
