'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'http://www.serpentinegalleries.org';

module.exports = function(venueName) {
  return {
    pageFinder: co.wrap(function*() {
      const result = [];
      const $ = yield pageLoader(`${BASE_URL}/?show=whats-on`);

      $(
        `#serpentine-ataglance-items article:has(.venue:contains("${venueName}")) .group-footer h4 a`
      ).each(function() {
        const href = $(this).attr('href');
        result.push(BASE_URL + href);
      });

      return result;
    }),
    pageParser: co.wrap(function*(pageUrl) {
      const $ = yield pageLoader(pageUrl);
      const title = $('#header h1').html();
      const data = [$('#content article').html()];
      return { title, data };
    }),
    venueOpenings: co.wrap(function*() {
      const $ = yield pageLoader(BASE_URL + '/visit');
      return $(
        'article.node-page-section:has(h2:contains("Information"))'
      ).html();
    }),
  };
};
