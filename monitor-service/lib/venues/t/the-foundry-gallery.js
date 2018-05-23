'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').spaLoader;

exports.pageParser = co.wrap(function*() {
  const $ = yield pageLoader(
    'http://www.thefoundrygallery.org/futureexhibitions/',
    'article.eventlist-event'
  );

  const data = [];

  $('article.eventlist-event').each(function() {
    data.push($(this).html());
  });

  return { data };
});

exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader('http://www.thefoundrygallery.org/new-page/');
  return $('#page').html();
});
