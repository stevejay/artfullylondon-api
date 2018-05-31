import * as formatter from "./formatter";

export default class SearchService {
  constructor(searcher) {
    this._searcher = searcher;
  }
  async getSitemapLinks(dateTo) {
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
              { range: { dateTo: { gte: formatter.formatDate(dateTo) } } }
            ],
            minimum_should_match: 1
          }
        }
      }
    });

    const links = searchResult.hits.hits.map(
      hit => process.env.SITEMAP_URL_PREFIX + "/event/" + hit._source.id
    );

    return links;
  }
}
