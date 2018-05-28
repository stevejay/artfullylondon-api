'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://cgplondon.org';

module.exports = function(venueName) {
  return {
    pageFinder: async function() {
      const $ = await pageLoader(BASE_URL + '/category/exhibitions/');
      const result = [];

      $(
        `article:has(.event-category:contains("${venueName}")) h2 a`
      ).each(function() {
        const href = $(this).attr('href');
        result.push(href);
      });

      return result;
    }),
    pageParser: async function(pageUrl) {
      const $ = await pageLoader(pageUrl);
      const title = $('h1').html();
      const data = $('.standard-page article').html();
      return { title, data };
    }),
    venueOpenings: async function() {
      const $ = await pageLoader(BASE_URL + '/visit/');
      return $('article .col-half.right').html();
    }),
  };
};
