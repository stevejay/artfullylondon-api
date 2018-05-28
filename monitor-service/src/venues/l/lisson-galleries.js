"use strict";

const pageLoader = require("../../venue-processing/page-loader").staticLoader;

const BASE_URL = "http://www.lissongallery.com";

module.exports = function(venueName) {
  return {
    pageFinder: async function() {
      const $ = await pageLoader(BASE_URL + "/exhibitions");
      const result = [];

      $(`.content .exhibitions a:contains("${venueName}")`).each(function() {
        const href = $(this).attr("href");
        result.push(BASE_URL + href);
      });

      return result.slice(0, 5);
    },
    pageParser: async function(pageUrl) {
      const $ = await pageLoader(pageUrl);
      const title = $("h2")
        .first()
        .html();

      const data = [
        $(".exhibition_header_date").html(),
        $(".text-content").html()
      ];

      return { title, data };
    },
    venueOpenings: async function() {
      const $ = await pageLoader(BASE_URL + "/contact");

      return $(".venue-address").each(function() {
        $(this).html();
      });
    }
  };
};
