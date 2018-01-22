'use strict';

const co = require('co');
const qsm = require('qsm');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader('http://beaconsfield.ltd.uk/projects/');

  $('#content a:has(img)').each(function() {
    let href = $(this).attr('href');
    result.push(qsm.clear(href));
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('#content-text').html();
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader('http://beaconsfield.ltd.uk/about/visiting/');
  return $('.entry-content').html();
});
