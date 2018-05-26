'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.theatrotechnis.com';

exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/index.php`);

  $('a:has(img)').each(function() {
    const href = $(this).attr('href');

    if (href.startsWith('show.php?')) {
      result.push(BASE_URL + '/' + href);
    }
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('td.title').html();
  const data = $('.main').html();
  return { title, data };
});
