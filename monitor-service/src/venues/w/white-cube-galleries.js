'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://whitecube.com';

module.exports = function(venueName) {
  return {
    pageFinder: async function() {
      const result = [];
      const $ = await pageLoader(`${BASE_URL}/exhibitions/`);

      $(
        `.tab-set section a:has(img):has(p:contains('${venueName}'))`
      ).each(function() {
        const href = $(this).attr('href');
        result.push(href);
      });

      $(
        `section:has(h1:contains('Future')) h2:contains('${venueName}') + ul li a`
      ).each(function() {
        const href = $(this).attr('href');
        result.push(href);
      });

      return result;
    }),
    pageParser: async function(pageUrl) {
      const $ = await pageLoader(pageUrl);
      const title = $('section.detail-item hgroup').html();
      const data = $('section.detail-item .featured').html();
      return { title, data };
    }),
    venueOpenings: async function() {
      const $ = await pageLoader(BASE_URL + '/contact/');

      return $('.main .address-item').each(function() {
        $(this).html();
      });
    }),
  };
};
