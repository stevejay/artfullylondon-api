'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.thedraytonarmstheatre.co.uk/';

exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL);
  const result = [];

  $('.calendarcell > a').each(function() {
    const href = $(this).attr('href');

    if (href.includes('/component/jevents/eventdetail/')) {
      result.push(BASE_URL + href);
    }
  });

  return result.slice(0, 4);
});

exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);

  const title = $('h1')
    .map(function() {
      return $(this).text();
    })
    .get()
    .join(' ');

  const data = $('#jevents').html();
  return { title, data };
});
