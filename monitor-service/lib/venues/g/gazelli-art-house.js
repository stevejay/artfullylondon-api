'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://gazelliarthouse.com';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];

  let $ = yield pageLoader(BASE_URL + '/exhibitions/');
  $('#sectionOne a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result.slice(0, 5);
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('#sectionOne .contentBox').html();
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact-us/');
  return $('.address-section').html();
});
