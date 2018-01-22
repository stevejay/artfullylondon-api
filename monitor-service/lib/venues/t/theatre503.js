'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;
// const pageLoader = require('../../venue-processing/page-loader').spaLoader;

const BASE_URL = 'https://theatre503.com';

module.exports.pageUrlChunks = 1;

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/`);

  $('#nav ul.children a').each(function() {
    const href = $(this).attr('href');

    if (href.includes('/whats-on/')) {
      result.push(href);
    }
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  return { title: pageUrl, data: pageUrl };

  // Error: Failed to GET url: https://theatre503.com/whats-on/punts/

  // const $ = yield pageLoader(pageUrl, '.DetailsContainer h1');
  // const title = $('.DetailsContainer h1').html();
  // const data = [$('.DetailsContainer').html()];
  // return { title, data };
});
