'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.waterlooeast.co.uk';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/`);

  $('a:has(img)').each(function() {
    const alt = $(this).find('img').attr('alt');

    if (alt && alt.includes('More info.')) {
      let href = $(this).attr('href');
      result.push(BASE_URL + '/' + href);
    }
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = [];

  $('p.Normal-P0').each(function() {
    data.push($(this).html());
  });

  return { title, data };
});
