'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://chisenhale.org.uk';

module.exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(
    BASE_URL + '/exhibitions/forthcoming_exhibitions.php'
  );
  const result = [];

  $('article a:has(h2)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + '/exhibitions/' + href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h2').html();
  const data = $('article').html();
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/visit/');
  return $('article').html();
});
