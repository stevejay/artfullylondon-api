"use strict";

const pageLoader = require("../../venue-processing/page-loader").staticLoader;

const BASE_URL = "https://www.nimaxtheatres.com";

module.exports = function(venueName) {
  return {
    pageFinder: async function() {
      const $ = await pageLoader(BASE_URL);
      const result = [];

      $("#content .section a").each(function() {
        const href = $(this).attr("href");

        if (!href.toLowerCase().startsWith(venueName)) {
          return;
        }

        result.push(BASE_URL + "/" + href);
      });

      return result;
    },
    pageParser: async function(pageUrl) {
      const $ = await pageLoader(pageUrl);
      const title = $("title").html();
      const data = $("#content").html();
      return { title, data };
    }
  };
};
