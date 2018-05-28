'use strict';


const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = 'https://www.victoria-miro.com';

module.exports = function(venueName) {
  return {
    pageFinder: async function() {
      const result = [];
      const $ = await pageLoader(`${BASE_URL}/exhibitions/`);

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
    pageParser: async function(pageUrl) {
      const $ = await pageLoader(pageUrl);
      const title = $('.heading_title').html();
      const data = [$('.hero_item').html(), $('.panel_content p').html()];
      return { title, data };
    }),
    venueOpenings: async function() {
      const $ = await pageLoader(BASE_URL + '/contact/');
      return $('#contact_general_information').html();
    }),
  };
};
