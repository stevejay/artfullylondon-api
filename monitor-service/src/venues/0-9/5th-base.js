"use strict";

const pageLoader = require("../../venue-processing/page-loader").spaLoader;

exports.pageParser = async function() {
  let $ = await pageLoader(
    "http://www.5thbase.co.uk/forthcoming",
    "#PAGES_CONTAINER"
  );

  const data = [$("#PAGES_CONTAINER").html()];

  $ = await pageLoader("http://www.5thbase.co.uk/", "#PAGES_CONTAINER");
  data.push($("#PAGES_CONTAINER").html());

  return { data };
};
