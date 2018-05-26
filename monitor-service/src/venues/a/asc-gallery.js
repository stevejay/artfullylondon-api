'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader('http://www.ascstudios.co.uk/asc-gallery/');
  const links = $('body').find('ul.gallery div.event a');
  const result = [];

  links.each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();

  const data = [
    $('div.tribe-events-schedule').html(),
    $('div.tribe-events-content.description').html(),
  ];

  return { title, data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader('http://www.ascstudios.co.uk/asc-gallery/');
  return $('#content .entry-content .frame').html();
});
