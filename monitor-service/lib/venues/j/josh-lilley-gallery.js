'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.joshlilleygallery.com';

module.exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/exhibitions');
  const result = [];

  $('section.slideshow li .exhibition[data-url]:has(img)').each(function() {
    let href = $(this).attr('data-url');
    result.push(BASE_URL + href);
  });

  return result.slice(0, 10);
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('.currentTitle.inDesktop').html();

  const data = [
    $('section span.datum').html(),
    $('section .pressrelease').html(),
  ];

  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact');
  return $('.container .row .col-sm-3').html();
});
