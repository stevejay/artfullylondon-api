"use strict";

const pageLoader = require("../../venue-processing/page-loader").staticLoader;

const BASE_URL = "http://www.gagosian.com";

module.exports = function(venueName) {
  return {
    pageFinder: async function() {
      const result = [];

      let $ = await pageLoader(BASE_URL + "/current");
      $(
        `.exhibition-grid-col:has(a span:contains("${venueName}")) a:has(img)`
      ).each(function() {
        const href = $(this).attr("href");

        if (href.startsWith("/exhibitions/")) {
          result.push(BASE_URL + href);
        }
      });

      $ = await pageLoader(BASE_URL + "/upcoming");
      $(`.info-detail a:contains("${venueName}")`).each(function() {
        const href = $(this).attr("href");
        result.push(href);
      });

      return result;
    },
    pageParser: async function(pageUrl) {
      const $ = await pageLoader(pageUrl);
      const title = $("title").html();

      const data = [
        $(".sub-nav-subheader").html(),
        $(".exhibition-detail-content-area p:not(:has(script))").each(
          function() {
            $(this).html();
          }
        )
      ];

      return { title, data };
    },
    venueOpenings: async function() {
      const $ = await pageLoader(BASE_URL + "/contact");
      return $(`.location-col:has(strong:contains("${venueName}"))`).html();
    }
  };
};
