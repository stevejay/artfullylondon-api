'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').spaLoader;

const BASE_URL = 'http://www.kingsheadtheatre.com';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(BASE_URL);

  $('a:has(img)').each(function() {
    let href = $(this).attr('href');

    if (href.includes('kingsheadtheatre.ticketsolve.com/')) {
      result.push(href);
    }
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  return { title: pageUrl, data: pageUrl };
});
