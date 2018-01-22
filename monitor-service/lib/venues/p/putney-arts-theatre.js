'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.putneyartstheatre.org.uk';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/whats-on/`);

  $('.listContent a:has(img)').each(function() {
    let href = $(this).attr('href');
    href = href.startsWith('http') ? href : BASE_URL + '/' + href;
    result.push(href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = [$('.content .container > div:nth-of-type(2)').html()];
  return { title, data };
});
