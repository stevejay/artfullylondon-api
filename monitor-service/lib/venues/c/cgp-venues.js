'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://cgplondon.org';

module.exports = function(venueName) {
  return {
    pageFinder: co.wrap(function*() {
      const $ = yield pageLoader(BASE_URL + '/category/exhibitions/');
      const result = [];

      $(
        `article:has(.event-category:contains("${venueName}")) h2 a`
      ).each(function() {
        const href = $(this).attr('href');
        result.push(href);
      });

      return result;
    }),
    pageParser: co.wrap(function*(pageUrl) {
      const $ = yield pageLoader(pageUrl);
      const title = $('h1').html();
      const data = $('.standard-page article').html();
      return { title, data };
    }),
    venueOpenings: co.wrap(function*() {
      const $ = yield pageLoader(BASE_URL + '/visit/');
      return $('article .col-half.right').html();
    }),
  };
};
