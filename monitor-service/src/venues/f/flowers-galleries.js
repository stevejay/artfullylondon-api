"use strict";

const pageLoader = require("../../venue-processing/page-loader").staticLoader;

const BASE_URL = "https://www.flowersgallery.com";

module.exports = function(venueName, venueNameForOpenings) {
  return {
    pageFinder: async function() {
      const result = [];

      let $ = await pageLoader(BASE_URL + "/exhibitions/current");
      $(`div.main .listing__item:contains("${venueName}") a:has(img)`).each(
        function() {
          const href = $(this).attr("href");

          if (href.startsWith(BASE_URL)) {
            result.push(href);
          }
        }
      );

      $ = await pageLoader(BASE_URL + "/exhibitions/upcoming");
      $(`div.main .listing__item:contains("${venueName}") a:has(img)`).each(
        function() {
          const href = $(this).attr("href");

          if (href.startsWith(BASE_URL)) {
            result.push(href);
          }
        }
      );

      return result;
    },
    pageParser: async function(pageUrl) {
      const $ = await pageLoader(pageUrl);
      const title = $("title").html();
      const data = [$(".entry__meta").html(), $(".entry__body").html()];
      return { title, data };
    },
    venueOpenings: async function() {
      const $ = await pageLoader(BASE_URL + "/about");
      return $(`#${venueNameForOpenings}`).html();
    }
  };
};
