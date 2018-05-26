'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://whitecube.com';

module.exports = function(venueName) {
  return {
    pageFinder: co.wrap(function*() {
      const result = [];
      const $ = yield pageLoader(`${BASE_URL}/exhibitions/`);

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
    pageParser: co.wrap(function*(pageUrl) {
      const $ = yield pageLoader(pageUrl);
      const title = $('section.detail-item hgroup').html();
      const data = $('section.detail-item .featured').html();
      return { title, data };
    }),
    venueOpenings: co.wrap(function*() {
      const $ = yield pageLoader(BASE_URL + '/contact/');

      return $('.main .address-item').each(function() {
        $(this).html();
      });
    }),
  };
};
