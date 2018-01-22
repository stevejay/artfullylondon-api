"use strict";

const co = require("co");
const pageLoader = require('../../venue-processing/page-loader').staticLoader;

const BASE_URL = "http://www.whitechapelgallery.org";

module.exports.pageFinder = co.wrap(function*() {
  const result = [];
  const $ = yield pageLoader(`${BASE_URL}/exhibitions/`);
  const sections = ["On Now", "Coming Soon"];

  for (let i = 0; i < sections.length; ++i) {
    $(
      `.pageContainer > .contentWrapper:has(h1:contains('${sections[i]}')) a:has(img)`
    ).each(function() {
      const href = $(this).attr("href");
      result.push(href);
    });
  }

  return result;
});

module.exports.pageParser = co.wrap(function*(pageUrl) {
  const $ = yield pageLoader(pageUrl);
  const title = $(".contentWrapper h1").html();

  const data = [
    $(".contentWrapper .visitStatus").html(),
    $(".contentWrapper .visitInfo").html()
  ];

  return { title, data };
});

module.exports.venueOpenings = co.wrap(function*() {
  const $ = yield pageLoader(BASE_URL + '/visit/');
  return $('.visit .row > .oneQuartMedia').html();
});
