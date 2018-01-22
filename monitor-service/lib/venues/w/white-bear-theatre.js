"use strict";

const co = require("co");
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = "http://whitebeartheatre.co.uk";

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/play/`);

  $("#primary article header a").each(function() {
    const href = $(this).attr("href");
    result.push(href);
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $("#primary article header h1").html();

  const data = [
    $("#primary article header").html(),
    $("#primary article .entry-content").html()
  ];

  return { title, data };
});
