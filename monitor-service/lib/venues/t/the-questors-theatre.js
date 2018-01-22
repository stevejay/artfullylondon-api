'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.questors.org.uk';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/whatson.aspx`);

  $('a:has(img)').each(function() {
    const href = $(this).attr('href');

    if (href.startsWith('event.aspx')) {
      result.push(BASE_URL + '/' + href);
    }
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1').html();
  const data = [$('.columns:has(h1)').html()];
  return { title, data };
});
