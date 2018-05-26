'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.sbf.org.uk';

exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(BASE_URL + '/evening-programme');

  $('#about a').each(function() {
    const href = $(this).attr('href');

    if (href.includes('/theatreshows/')) {
      result.push(BASE_URL + href);
    }
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('#about').html();
  return { title, data };
});
