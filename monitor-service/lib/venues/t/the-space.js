'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://space.org.uk';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/events/`);

  $('.description a:contains(\'Find out more\')').each(function() {
    const href = $(this).attr('href');

    if (href.includes('/event/')) {
      result.push(href);
    }
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h2.entry-title').html();

  const data = [
    $('.tribe-events-meta-group-details').html(),
    $('#content-wrap .description').html(),
  ];

  return { title, data };
});
