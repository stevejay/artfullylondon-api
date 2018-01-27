'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader('https://artstheatrewestend.co.uk/whats-on/');

  $('#main .whats-on-item a:first-of-type').each(function() {
    const href = $(this).attr('href').replace('\'', '');
    result.push(href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('.whats-on-event').html();
  return { title, data };
});
