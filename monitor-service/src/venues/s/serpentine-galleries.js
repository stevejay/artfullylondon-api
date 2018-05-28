"use strict";

const pageLoader = require("../../venue-processing/page-loader").staticLoader;

const BASE_URL = "http://www.serpentinegalleries.org";

module.exports = function(venueName) {
  return {
    pageFinder: async function() {
      const result = [];
      const $ = await pageLoader(`${BASE_URL}/?show=whats-on`);

      $(
        `#serpentine-ataglance-items article:has(.venue:contains("${venueName}")) .group-footer h4 a`
      ).each(function() {
        const href = $(this).attr("href");
        result.push(BASE_URL + href);
      });

      return result;
    },
    pageParser: async function(pageUrl) {
      const $ = await pageLoader(pageUrl);
      const title = $("#header h1").html();
      const data = [$("#content article").html()];
      return { title, data };
    },
    venueOpenings: async function() {
      const $ = await pageLoader(BASE_URL + "/visit");
      return $(
        'article.node-page-section:has(h2:contains("Information"))'
      ).html();
    }
  };
};
