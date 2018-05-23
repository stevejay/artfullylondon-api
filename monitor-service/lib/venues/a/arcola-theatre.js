'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageFinder = co.wrap(function*() {
  const result = [];

  let $ = yield pageLoader(
    'http://www.arcolatheatre.com/events/category/main/'
  );
  $('a.tribe-event-url').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  $ = yield pageLoader('http://www.arcolatheatre.com/events/category/ce/');
  $('a.tribe-event-url').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();

  const data = [
    $('.tribe-events-content').html(),
    $('.credits').html(),
    $('div.row:has(h3:contains("Tickets"))').html(),
  ];

  return { title, data };
});
