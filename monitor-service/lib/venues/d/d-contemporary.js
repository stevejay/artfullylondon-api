'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://dcontemporary.com';

module.exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/future-exhibitions/');
  const result = [];

  $('.content .wpb_wrapper a').each(function() {
    const href = $(this)
      .attr('href')
      .replace('http:/dcontemporary', 'http://dcontemporary');

    result.push(href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('.content').html();
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact/');
  return $('.wpb_column:has(h3:contains("D-Contemporary"))').html();
});
