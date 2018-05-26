'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.lionandunicorntheatre.co.uk';

exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/');
  const result = [];

  $('figure > a:has(img)').each(function() {
    const href = $(this).attr('href');

    if (href.startsWith('http')) {
      result.push(href);
    }
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('#tz-main-body-wrapper').html();
  return { title, data };
});
