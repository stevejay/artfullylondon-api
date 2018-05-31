import format from "date-fns/format";

export default class SitemapService {
  constructor(searcher, urlPrefix) {
    this._searcher = searcher;
    this._urlPrefix = urlPrefix;
  }
  async getSitemapEventLinks(dateTo) {
    const searchResult = await this._searcher.search({
      index: "event-full",
      type: "doc",
      body: {
        _source: "id",
        from: 0,
        size: 5000,
        query: {
          bool: {
            filter: [{ term: { status: "Active" } }],
            should: [
              { term: { occurrenceType: "Continuous" } },
              {
                range: {
                  dateTo: {
                    gte: format(dateTo, "YYYY/MM/DD")
                  }
                }
              }
            ],
            minimum_should_match: 1
          }
        }
      }
    });

    return searchResult.hits.hits.map(
      hit => `${this._urlPrefix}/event/${hit._source.id}`
    );
  }
}
