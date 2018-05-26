'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.transitiongallery.co.uk/htmlpages';

exports.pageFinder = co.wrap(function*() {
  let result = [];

  let $ = yield pageLoader(`${BASE_URL}/shows.htm`);
  $('strong > em > a').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + '/' + href);
  });

  result = result.slice(0, 4);

  $ = yield pageLoader(`${BASE_URL}/future.htm`);
  $('strong > em > a').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + '/' + href);
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('body > table').html();
  return { title, data };
});
