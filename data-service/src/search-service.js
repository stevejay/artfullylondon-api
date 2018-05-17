"use strict";

const dateUtil = require("./date-util");

class SearchService {
  constructor(searcher) {
    this._searcher = searcher;
  }
  async getSitemapLinks(dateTo) {
    const formattedDate = dateUtil.formatDate(dateTo);

    const searchResult = await this._searcher({
      index: "event-full",
      type: "default",
      body: {
        _source: "id",
        from: 0,
        size: 5000,
        query: {
          bool: {
            filter: [{ term: { status: "Active" } }],
            should: [
              { term: { occurrenceType: "Continuous" } },
              { range: { dateTo: { gte: formattedDate } } }
            ],
            minimum_should_match: 1
          }
        }
      }
    });

    const links = searchResult.hits.hits.map(
      hit => "https://www.artfully.london/event/" + hit._source.id
    );

    return links;
  }
}

module.exports = SearchService;
