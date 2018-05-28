"use strict";

const pageLoader = require("../../venue-processing/page-loader").staticLoader;

const BASE_URL = "http://71alondon.com";

exports.pageFinder = async function() {
  const $ = await pageLoader(BASE_URL + "/category/events/");
  const result = [];

  $("h2.posttitle > a").each(function() {
    const href = $(this).attr("href");

    if (!href.toLowerCase().startsWith(BASE_URL + "/class-")) {
      result.push(href);
    }
  });

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $("title").html();
  const data = $("div.entry")
    .find('div[itemprop="description"]')
    .html();
  return { title, data };
};
