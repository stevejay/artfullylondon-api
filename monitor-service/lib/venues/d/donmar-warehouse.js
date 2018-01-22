'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.donmarwarehouse.com';

module.exports.pageFinder = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/whats-on/');
  const result = [];

  $('.production-card a').each(function() {
    let href = $(this).attr('href');

    if (!href.startsWith('http')) {
      href = BASE_URL + href;
    }

    result.push(href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $('h1').html();
  const data = $('.article-content .article-body').html();
  return { title, data };
});
