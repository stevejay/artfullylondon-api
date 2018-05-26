'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.halcyongallery.com';

module.exports = function(venueName) {
  return {
    pageFinder: co.wrap(function*() {
      const result = [];

      let $ = yield pageLoader(BASE_URL + '/exhibitions/filter/all');
      $('section .rsContent h2 a').each(function() {
        const href = $(this).attr('href');

        if (href.includes('/exhibitions/')) {
          result.push(href);
        }
      });

      $(`a.grid_3.portal:has(h3:contains("${venueName}"))`).each(function() {
        const href = $(this).attr('href');

        if (href.includes('/exhibitions/')) {
          result.push(href);
        }
      });

      return result.slice(0, 5);
    }),
    pageParser: co.wrap(function*(pageUrl) {
      const $ = yield pageLoader(pageUrl);
      const title = $('title').html();
      const data = $('.main.site-container').html();
      return { title, data };
    }),
    venueOpenings: co.wrap(function*() {
      const $ = yield pageLoader(BASE_URL + '/contact');

      return $('.site-container .contact-row').each(function() {
        $(this).html();
      });
    }),
  };
};
