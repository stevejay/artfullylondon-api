'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.jacobsongallery.com';

exports.pageFinder = co.wrap(function*() {
  const result = [];
  let $ = yield pageLoader(BASE_URL + '/index.php?nav=exhibitions');

  $('#exhibitionDetails a').each(function() {
    let href = $(this).attr('href');
    result.push(BASE_URL + '/' + href);
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();

  const data = $('p').each(function() {
    $(this).html();
  });

  return { title, data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/index.php?nav=contactus');
  return $('#attop table').html();
});
