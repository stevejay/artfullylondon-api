'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.unrestrictedview.co.uk';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];

  let $ = yield pageLoader(BASE_URL + '/venue/');
  $('#events-widget-4 li a').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h3.event_title').html();

  const data = [
    $('#page-wrap .page-container .event_description').html(),
    $('#page-wrap .page-container .espresso_event_full').html(),
  ];

  return { title, data };
});
