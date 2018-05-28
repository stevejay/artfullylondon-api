'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

exports.pageFinder = async function() {
  const result = [];

  let $ = await pageLoader(
    'http://www.arcolatheatre.com/events/category/main/'
  );
  $('a.tribe-event-url').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  $ = await pageLoader('http://www.arcolatheatre.com/events/category/ce/');
  $('a.tribe-event-url').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $('title').html();

  const data = [
    $('.tribe-events-content').html(),
    $('.credits').html(),
    $('div.row:has(h3:contains("Tickets"))').html(),
  ];

  return { title, data };
};
