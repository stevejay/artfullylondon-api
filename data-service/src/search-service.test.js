"use strict";

const SearchService = require("./search-service");

process.env.SITEMAP_URL_PREFIX = "https://www.artfully.london";

describe("SearchService", () => {
  describe("getSitemapLinks", () => {
    it("should get sitemap links", async () => {
      const mockSearcher = jest.fn().mockResolvedValue({
        hits: { hits: [{ _source: { id: "a/b/c" } }] }
      });
      const searchService = new SearchService(mockSearcher);
      const actual = await searchService.getSitemapLinks(
        new Date(1491560202450)
      );
      expect(actual).toEqual(["https://www.artfully.london/event/a/b/c"]);
    });
  });
});
