'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageParser = co.wrap(function*() {
  let $ = yield pageLoader('http://www.lawrencealkingallery.com/events');
  const data = [$('.eventarticle').html()];

  $ = yield pageLoader('http://www.lawrencealkingallery.com/futureevents');
  data.push($('.futureeventsummary').html());

  return { data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader('http://www.lawrencealkingallery.com/contact');
  return $('#contactright').html();
});
