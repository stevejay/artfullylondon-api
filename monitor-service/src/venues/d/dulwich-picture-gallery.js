'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.dulwichpicturegallery.org.uk';

exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(
    BASE_URL + '/whats-on/?category=43986&date=&PageId=1055'
  );
  const result = [];

  $('.content-container.whatson a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1').html();

  const data = [
    $('main + .callout .callout-content').html(),
    $('.content-container main').html(),
  ];

  return { title, data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/visit/opening-times/');
  return $('.content main').html();
});
