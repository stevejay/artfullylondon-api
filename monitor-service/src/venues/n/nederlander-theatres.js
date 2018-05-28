'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.nederlander.co.uk';

module.exports = function(venueName) {
  return {
    pageFinder: async function() {
      const $ = await pageLoader(
        BASE_URL + '/whats-on?from=2017-03-01&to=2020-03-31'
      );
      const result = [];

      $('a').each(function() {
        const venue = $(this).find('.venue').text().trim();
        if (venue !== venueName) {
          return;
        }

        const href = $(this).attr('href');
        result.push(BASE_URL + href);
      });

      return result;
    }),
    pageParser: async function(pageUrl) {
      const $ = await pageLoader(pageUrl);

      const title = $('.content-area .big-strap').html();

      const data = [
        $('.content-area .big-strap').html(),
        $('.content-area .article').html(),
        $('.performances').html(),
      ];

      return { title, data };
    }),
  };
};
