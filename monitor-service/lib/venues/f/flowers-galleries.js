'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.flowersgallery.com';

module.exports = function(venueName, venueNameForOpenings) {
  return {
    pageFinder: co.wrap(function*() {
      const result = [];

      let $ = yield pageLoader(BASE_URL + '/exhibitions/current');
      $(
        `div.main .listing__item:contains("${venueName}") a:has(img)`
      ).each(function() {
        const href = $(this).attr('href');

        if (href.startsWith(BASE_URL)) {
          result.push(href);
        }
      });

      $ = yield pageLoader(BASE_URL + '/exhibitions/upcoming');
      $(
        `div.main .listing__item:contains("${venueName}") a:has(img)`
      ).each(function() {
        const href = $(this).attr('href');

        if (href.startsWith(BASE_URL)) {
          result.push(href);
        }
      });

      return result;
    }),
    pageParser: co.wrap(function*(pageUrl) {
      const $ = yield pageLoader(pageUrl);
      const title = $('title').html();
      const data = [$('.entry__meta').html(), $('.entry__body').html()];
      return { title, data };
    }),
    venueOpenings: co.wrap(function*() {
      const $ = yield pageLoader(BASE_URL + '/about');
      return $(`#${venueNameForOpenings}`).html();
    }),
  };
};
