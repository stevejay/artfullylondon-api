'use strict';

const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://new-www.atgtickets.com';

module.exports = function(venueName) {
  return {
    pageFinder: async function() {
      const $ = await pageLoader(`${BASE_URL}/venues/${venueName}/shows`);
      const result = [];

      $('a.button:contains("More Details")').each(function() {
        const href = $(this).attr('href');
        result.push(BASE_URL + href);
      });

      return result;
    }),
    pageParser: async function(pageUrl) {
      const $ = await pageLoader(pageUrl);
      const title = $('h1').first().html();
      const data = $('#mainContent .show-intro').html();
      return { title, data };
    }),
  };
};
