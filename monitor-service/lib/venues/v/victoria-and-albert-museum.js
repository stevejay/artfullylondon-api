'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.vam.ac.uk';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const categories = ['exhibition', 'family', 'special-event'];

  for (let i = 0; i < categories.length; ++i) {
    const $ = yield pageLoader(`${BASE_URL}/whatson?type=${categories[i]}/`);

    $('.wo-events li a:has(img)').each(function() {
      const href = $(this).attr('href');
      result.push(BASE_URL + href);
    });
  }

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('title').html();
  const data = $('main').html();
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/visit');
  return $('#hours').html();
});
