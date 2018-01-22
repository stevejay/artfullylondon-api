'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.coningsbygallery.com';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];

  const $ = yield pageLoader(`${BASE_URL}/exhibitions`);
  $('section.exhibitions ul li a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('#content article h2').html();
  const data = [$('#content article').html(), $('#content .opening').html()];
  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/contact');
  return $('.span-5:has(h2:contains("Gallery information"))').html();
});
