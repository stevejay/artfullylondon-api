'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.galleryso.com';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];

  let $ = yield pageLoader(BASE_URL + '/exhibitions/');
  $('#exhibitions-grid-container a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result.slice(0, 5);
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1').html();

  const data = [
    $('.exhibition-header').html(),
    $('#content_module .description').html(),
  ];

  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact/');
  return $('#custom_content_1').html();
});
