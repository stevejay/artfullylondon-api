'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.rebeccahossack.com';

module.exports = function(venueName) {
  return {
    pageFinder: co.wrap(function*() {
      const result = [];
      const $ = yield pageLoader(`${BASE_URL}/exhibitions/`);

      function hrefCallback() {
        const href = $(this).attr('href');
        result.push(BASE_URL + href);
      }

      $(
        `#exhibitions-grid-current li:has(.location:contains("${venueName}")) a:has(img)`
      ).each(hrefCallback);

      $(
        `#exhibitions-grid-current_featured li:has(.location:contains("${venueName}")) a:has(img)`
      ).each(hrefCallback);

      $(
        `#exhibitions-grid-forthcoming li:has(.location:contains("${venueName}")) a:has(img)`
      ).each(hrefCallback);

      $(
        `#exhibitions-grid-forthcoming_featured li:has(.location:contains("${venueName}")) a:has(img)`
      ).each(hrefCallback);

      return result;
    }),
    pageParser: co.wrap(function*(pageUrl) {
      const $ = yield pageLoader(pageUrl);
      const title = $('.exhibition-header h1').html();

      const data = [
        $('.exhibition-header').html(),
        $('#content_module .description').html(),
      ];

      return { title, data };
    }),
    venueOpenings: co.wrap(function*() {
      const $ = yield pageLoader(BASE_URL + '/about/locations/');
      
      return $(
        `.locations > li:has(span.street:contains("${venueName}")) .address`
      ).html();
    }),
  };
};
