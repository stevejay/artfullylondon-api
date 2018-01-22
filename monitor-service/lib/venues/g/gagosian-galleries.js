'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.gagosian.com';

module.exports = function(venueName) {
  return {
    pageFinder: co.wrap(function*() {
      const result = [];

      let $ = yield pageLoader(BASE_URL + '/current');
      $(
        `.exhibition-grid-col:has(a span:contains("${venueName}")) a:has(img)`
      ).each(function() {
        const href = $(this).attr('href');

        if (href.startsWith('/exhibitions/')) {
          result.push(BASE_URL + href);
        }
      });

      $ = yield pageLoader(BASE_URL + '/upcoming');
      $(`.info-detail a:contains("${venueName}")`).each(function() {
        const href = $(this).attr('href');
        result.push(href);
      });

      return result;
    }),
    pageParser: co.wrap(function*(pageUrl) {
      const $ = yield pageLoader(pageUrl);
      const title = $('title').html();

      const data = [
        $('.sub-nav-subheader').html(),
        $(
          '.exhibition-detail-content-area p:not(:has(script))'
        ).each(function() {
          $(this).html();
        }),
      ];

      return { title, data };
    }),
    venueOpenings: co.wrap(function*() {
      const $ = yield pageLoader(BASE_URL + '/contact');
      return $(`.location-col:has(strong:contains("${venueName}"))`).html();
    }),
  };
};
