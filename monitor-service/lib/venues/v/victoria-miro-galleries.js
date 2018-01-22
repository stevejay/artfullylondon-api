'use strict';

const co = require('co');
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.victoria-miro.com';

module.exports = function(venueName) {
  return {
    pageFinder: co.wrap(function*() {
      const result = [];
      const $ = yield pageLoader(`${BASE_URL}/exhibitions/`);

      function hrefCallback() {
        const href = $(this).attr('href');
        result.push(BASE_URL + href);
      }

      $(`#exhibitions-grid-current a:has(img):contains('${venueName}')`).each(
        hrefCallback
      );

      $(
        `#exhibitions-grid-current_featured a:has(img):contains('${venueName}')`
      ).each(hrefCallback);

      $(
        `#exhibitions-grid-forthcoming a:has(img):contains('${venueName}')`
      ).each(hrefCallback);

      $(
        `#exhibitions-grid-forthcoming_featured a:has(img):contains('${venueName}')`
      ).each(hrefCallback);

      return result;
    }),
    pageParser: co.wrap(function*(pageUrl) {
      const $ = yield pageLoader(pageUrl);
      const title = $('.heading_title').html();
      const data = [$('.hero_item').html(), $('.panel_content p').html()];
      return { title, data };
    }),
    venueOpenings: co.wrap(function*() {
      const $ = yield pageLoader(BASE_URL + '/contact/');
      return $('#contact_general_information').html();
    }),
  };
};
