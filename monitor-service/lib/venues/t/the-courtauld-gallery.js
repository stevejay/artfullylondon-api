'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').spaLoader;

module.exports.pageParser = co.wrap(function*() {
  let $ = yield pageLoader(
    'http://courtauld.ac.uk/gallery/what-on/exhibitions-displays',
    '.article-content'
  );

  const data = [$('.article-content').html()];

  $ = yield pageLoader(
    'http://courtauld.ac.uk/gallery/what-on/calendar?show_all=true',
    '.post-listing ul'
  );

  data.push($('.post-listing ul').html());

  return { data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader('http://courtauld.ac.uk/gallery/opening-hours');
  return $('.article-content').html();
});
