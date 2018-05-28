"use strict";

const pageLoader = require("../../venue-processing/page-loader").staticLoader;

const BASE_URL = "https://www.halcyongallery.com";

module.exports = function(venueName) {
  return {
    pageFinder: async function() {
      const result = [];

      let $ = await pageLoader(BASE_URL + "/exhibitions/filter/all");
      $("section .rsContent h2 a").each(function() {
        const href = $(this).attr("href");

        if (href.includes("/exhibitions/")) {
          result.push(href);
        }
      });

      $(`a.grid_3.portal:has(h3:contains("${venueName}"))`).each(function() {
        const href = $(this).attr("href");

        if (href.includes("/exhibitions/")) {
          result.push(href);
        }
      });

      return result.slice(0, 5);
    },
    pageParser: async function(pageUrl) {
      const $ = await pageLoader(pageUrl);
      const title = $("title").html();
      const data = $(".main.site-container").html();
      return { title, data };
    },
    venueOpenings: async function() {
      const $ = await pageLoader(BASE_URL + "/contact");

      return $(".site-container .contact-row").each(function() {
        $(this).html();
      });
    }
  };
};
