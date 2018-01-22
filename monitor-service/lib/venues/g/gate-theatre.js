'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.gatetheatre.co.uk';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];

  let $ = yield pageLoader(BASE_URL + '/events/all-productions');
  $('#content section:first-of-type .productions a:has(h2)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + '/events/' + href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = pageUrl.substring(pageUrl.lastIndexOf('/') + 1);

  const data = [
    $('#content .columns:first-of-type .production-details').html(),
    $('#content .key-dates').html(),
    $('#content .production-info').html(),
  ];

  return { title, data };
});
