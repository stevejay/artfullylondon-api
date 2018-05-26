'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageFinder = co.wrap(function*() {
  let $ = yield pageLoader('http://www.atlasgallery.com/current-exhibitions');

  const currentExhibitionLinks = $('body')
    .find('section.content div:has(h2:contains("Current Exhibitions"))')
    .find('a');

  $ = yield pageLoader('http://www.atlasgallery.com/future-exhibitions');

  const futureExhibitionLinks = $('body')
    .find('section.content div:has(h2:contains("Future Exhibitions"))')
    .find('a');

  const result = [];

  currentExhibitionLinks.each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  futureExhibitionLinks.each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('.content h1').html();
  const data = $('main.content > div:first-of-type').html();
  return { title, data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader('http://www.atlasgallery.com/contact');
  return $('section.content article').html();
});
