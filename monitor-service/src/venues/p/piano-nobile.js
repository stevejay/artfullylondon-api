"use strict";

const pageLoader = require("../../venue-processing/page-loader").staticLoader;

const BASE_URL = "http://www.piano-nobile.com";

module.exports = function(venueName, venueOpeningTimesUrl) {
  return {
    minimumExpectedEvents: 0,
    pageFinder: async function() {
      const $ = await pageLoader(`${BASE_URL}/exhibitions/`);
      const result = [];

      function hrefCallback() {
        const href = $(this).attr("href");
        result.push(BASE_URL + href);
      }

      $(
        `#exhibitions-grid-current ul li:has(.location:contains("${venueName}")) a:has(img)`
      ).each(hrefCallback);

      $(
        `#exhibitions-grid-current_featured ul li:has(.location:contains("${venueName}")) a:has(img)`
      ).each(hrefCallback);

      $(
        `#exhibitions-grid-forthcoming ul li:has(.location:contains("${venueName}")) a:has(img)`
      ).each(hrefCallback);

      $(
        `#exhibitions-grid-forthcoming_featured ul li:has(.location:contains("${venueName}")) a:has(img)`
      ).each(hrefCallback);

      return result;
    },
    pageParser: async function(pageUrl) {
      const $ = await pageLoader(pageUrl);
      const title = $("h1")
        .first()
        .html();

      const data = [
        $(".exhibition-header").html(),
        $(".exhibition-full-details .description").html()
      ];

      return { title, data };
    },
    venueOpenings: async function() {
      const $ = await pageLoader(
        BASE_URL + "/contact/" + venueOpeningTimesUrl + "/"
      );
      return $("#content_module").html();
    }
  };
};
