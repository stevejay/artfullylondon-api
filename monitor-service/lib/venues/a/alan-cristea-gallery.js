'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.alancristea.com';

module.exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/schedule.php');
  const result = [];

  $('.artfair-container a').each(function() {
    const href = BASE_URL + '/' + $(this).attr('href');
    result.push(href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h2.artfair-title').html();
  const data = $('p.artfair-date').parent().html();
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact.php');
  return $('.contact-span:has(p)').html();
});
