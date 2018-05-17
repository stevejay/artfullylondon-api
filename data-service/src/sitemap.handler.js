"use strict";

const esSearch = require("../lib/external-services/elasticsearch");
const SearchService = require("../lib/services/search");

const searchService = new SearchService(esSearch.search);

module.exports.handler = async () => {
  try {
    const links = await searchService.getSitemapLinks(new Date());
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
      },
      body: links.join("\n")
    };
  } catch (err) {
    return err;
  }
};
