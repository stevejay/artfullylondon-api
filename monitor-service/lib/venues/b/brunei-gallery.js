'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.soas.ac.uk';

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(BASE_URL + '/gallery/forthcoming/');

  $('#content li a').each(function() {
    const href = $(this).attr('href');
    result.push(BASE_URL + href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('article.eventdetail').html();
  return { title, data };
});
