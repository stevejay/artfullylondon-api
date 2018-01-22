'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.tiwani.co.uk';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];

  let $ = yield pageLoader(BASE_URL + '/exhibitions/upcoming/');

  $('body > .container-fluid a').each(function() {
    const href = $(this).attr('href');

    if (href.includes('/exhibitions/')) {
      result.push(href);
    }
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);

  const title = $('.gallery-item h2').each(function() {
    return $(this).html();
  });

  const data = $('.gallery-item').html();
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact/');
  return $('body > .container-fluid').html();
});
