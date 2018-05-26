'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

module.exports = function(venueName) {
  return {
    pageParser: co.wrap(function*() {
      let $ = yield pageLoader(
        'http://www.sadiecoles.com/current-exhibitions.html'
      );

      const data = $(
        `section .copy-div:contains("${venueName}") .english-content`
      ).html();

      return { data };
    }),
    venueOpenings: co.wrap(function*() {
      const $ = yield pageLoader('http://www.sadiecoles.com/contact.html');
      return $('.content-container').html();
    }),
  };
};
