"use strict";

const co = require("co");
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = "http://www.shakespearesglobe.com";

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/theatre/whats-on`);

  $("#mainArticle a:has(img)").each(function() {
    const href = $(this).attr("href");

    if (!href.includes("#")) {
      result.push(href);
    }
  });

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $("title").html();
  const data = [$("article.showdates").html(), $("#mainArticle").html()];
  return { title, data };
});
