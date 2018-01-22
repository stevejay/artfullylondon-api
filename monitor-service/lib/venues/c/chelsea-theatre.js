'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.chelseatheatre.org.uk';

module.exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/whats-on/');
  const result = [];

  $('main article a:has(img)').each(function() {
    const href = $(this).attr('href');
    result.push(href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1').html();

  const data = [
    $('article .book-information').html(),
    $('article .entry-content').html(),
  ];

  return { title, data };
});
