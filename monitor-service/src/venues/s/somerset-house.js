"use strict";

const pageLoader = require("../../venue-processing/page-loader").staticLoader;

const BASE_URL = "https://www.somersethouse.org.uk";

exports.pageFinder = async function() {
  const result = [];
  let pageNo = 0;

  for (;;) {
    const url = `${BASE_URL}/whats-on?page=${pageNo}`;
    const $ = await pageLoader(url);
    const links = $(".view-content .field-content > a:has(img)");

    if (links.length === 0) {
      break;
    }

    links.each(function() {
      const href = $(this).attr("href");
      result.push(BASE_URL + href);
    });

    ++pageNo;
  }

  return result;
};

exports.pageParser = async function(pageUrl) {
  const $ = await pageLoader(pageUrl);
  const title = $("h1.node__title").html();
  const data = $(".l-content").html();
  return { title, data };
};

exports.venueOpenings = async function() {
  const $ = await pageLoader(BASE_URL + "/opening-times-prices");
  return $(".group-main-content .content").html();
};
