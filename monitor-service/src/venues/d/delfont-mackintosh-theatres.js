"use strict";

const pageLoader = require("../../venue-processing/page-loader").staticLoader;

const BASE_URL = "https://www.delfontmackintosh.co.uk";

module.exports = function(venueName) {
  return {
    pageFinder: async function() {
      const $ = await pageLoader(`${BASE_URL}/theatres/${venueName}/index.php`);
      const result = [];

      $("a:has(.tickets-landing)").each(function() {
        const href = $(this).attr("href");
        result.push(BASE_URL + href.replace(/^\.\.\/\.\.\//, "/"));
      });

      return result;
    },
    pageParser: async function(pageUrl) {
      let $ = await pageLoader(pageUrl);
      const title = $("title")
        .first()
        .html();
      const data = [$(".show-info-main-container").html()];

      const timesPageUrl = $(
        '.show-right-container ul li a:contains("Performance Times")'
      ).attr("href");

      $ = await pageLoader(pageUrl.replace(/\/[^/]+$/, "/") + timesPageUrl);

      data.push(
        $(
          ".show-info-specific-outer-container .show-info-specific-inner-container"
        ).html()
      );

      return { title, data };
    }
  };
};
