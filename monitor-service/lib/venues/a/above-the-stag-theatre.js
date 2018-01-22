'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

module.exports.pageParser = co.wrap(function*() {
  let $ = yield pageLoader('http://www.abovethestag.com/whatson/');

  const title = $('title').html();
  const data = [$('main').html()];

  $ = yield pageLoader('http://www.abovethestag.com/shows/');

  $('.tribe-events-loop .type-tribe_events').each(() => {
    const title = $(this).find('.tribe-events-list-event-title').text();
    const date = $(this).find('.tribe-event-date-start').text();
    data.push([title, date].join(' - '));
  });

  return { title, data };
});
