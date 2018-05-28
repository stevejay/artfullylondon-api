"use strict";

const pageLoader = require("../../venue-processing/page-loader").staticLoader;

const BASE_URL = "http://www.tate.org.uk";

module.exports = function(venueName, venueOpeningsName) {
  return {
    pageFinder: async function() {
      const result = [];

      const eventGroups = [
        "exhibitions",
        "talks_and_lectures",
        "tours",
        "performances"
      ]; // 'events'];

      for (let i = 0; i < eventGroups.length; ++i) {
        const $ = await pageLoader(
          `${BASE_URL}/whats-on?event_group=${
            eventGroups[i]
          }&gallery_group=${venueName}&daterange=fromnow`
        );

        $("section.container .card-media a:has(img)").each(function() {
          const href = $(this).attr("href");
          result.push(BASE_URL + href);
        });
      }

      return result;
    },
    pageParser: async function(pageUrl) {
      const $ = await pageLoader(pageUrl);
      const title = $("#content h1").html();
      const data = [$("header.content-header").html()];

      $("section.content-main .content__body-text p").map(function() {
        data.push($(this).html());
      });

      return { title, data };
    },
    venueOpenings: async function() {
      const $ = await pageLoader(
        BASE_URL + `/visit/${venueOpeningsName}#visit`
      );

      return $(".content-block--opening-times").html();
    }
  };
};
