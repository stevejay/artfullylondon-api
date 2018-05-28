"use strict";

const pageLoader = require("../../venue-processing/page-loader").staticLoader;

exports.pageParser = async function() {
  let $ = await pageLoader("http://www.abovethestag.com/whatson/");

  const title = $("title").html();
  const data = [$("main").html()];

  $ = await pageLoader("http://www.abovethestag.com/shows/");

  $(".tribe-events-loop .type-tribe_events").each(() => {
    const title = $(this)
      .find(".tribe-events-list-event-title")
      .text();
    const date = $(this)
      .find(".tribe-event-date-start")
      .text();
    data.push([title, date].join(" - "));
  });

  return { title, data };
};
