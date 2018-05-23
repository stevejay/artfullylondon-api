'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = co.wrap(function*() {
  const data = [];

  let $ = yield pageLoader('http://williambeningtongallery.co.uk/londonevents');
  data.push($('#page').html());

  return { data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader('http://williambeningtongallery.co.uk/contact/');

  return $(
    '.sqs-block-content:has(h3:contains("WILLIAM BENINGTON GALLERY"))'
  ).each(function() {
    $(this).html();
  });
});
