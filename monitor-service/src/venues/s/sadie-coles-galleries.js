'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

module.exports = function(venueName) {
  return {
    pageParser: async function() {
      let $ = await pageLoader(
        'http://www.sadiecoles.com/current-exhibitions.html'
      );

      const data = $(
        `section .copy-div:contains("${venueName}") .english-content`
      ).html();

      return { data };
    }),
    venueOpenings: async function() {
      const $ = await pageLoader('http://www.sadiecoles.com/contact.html');
      return $('.content-container').html();
    }),
  };
};
