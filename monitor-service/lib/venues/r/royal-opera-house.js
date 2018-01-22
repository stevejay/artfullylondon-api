'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.roh.org.uk';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];

  let $ = yield pageLoader(`${BASE_URL}/productions`);
  $('#content article ul li a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  $ = yield pageLoader(`${BASE_URL}/insights`);
  $('#content article ul li a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  result.push('http://www.roh.org.uk/tours/backstage-tour');
  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1').html();
  const data = [$('.subHdrLt').html(), $('.performances').html()];
  return { title, data };
});
