"use strict";

const SearchService = require("./search");

describe("SearchService", () => {
  describe("getSitemapLinks", () => {
    it("should get sitemap links", async () => {
      const mockSearch = jest.fn().mockResolvedValue({
        hits: { hits: [{ _source: { id: "a/b/c" } }] }
      });
      const searchService = new SearchService(mockSearch);
      const actual = await searchService.getSitemapLinks(
        new Date(1491560202450)
      );
      expect(actual).toEqual(["https://www.artfully.london/event/a/b/c"]);
    });
  });
});
