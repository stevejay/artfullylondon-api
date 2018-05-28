'use strict';


const pageLoader = require('../../venue-processing/page-loader').spaLoader;

exports.pageParser = async function() {
  const $ = await pageLoader(
    'http://www.thefoundrygallery.org/futureexhibitions/',
    'article.eventlist-event'
  );

  const data = [];

  $('article.eventlist-event').each(function() {
    data.push($(this).html());
  });

  return { data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader('http://www.thefoundrygallery.org/new-page/');
  return $('#page').html();
};
