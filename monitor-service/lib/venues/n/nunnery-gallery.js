'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.bowarts.org';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/nunnery/exhibitions`);

  $('.blog-image a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('#page-title').html();
  const data = $('main article').html();
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/about/contact-us');
  return $('main article').html();
});
