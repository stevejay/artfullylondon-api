'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.davidzwirner.com';

module.exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/exhibitions');
  const result = [];

  $(
    'article.exhibitionItem > a:has(.exhibitionItem--city:contains("London"))'
  ).each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();

  const data = [
    $('.pane-content p').each(function() {
      $(this).html();
    }),
    $('.pane-content date:nth-of-type(1)').data('value'),
    $('.pane-content date:nth-of-type(2)').data('value'),
  ];

  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL);
  return $('.galleriesList').html();
});
