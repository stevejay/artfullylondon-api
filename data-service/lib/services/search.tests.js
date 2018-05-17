"use strict";

const expect = require("chai").expect;
const sinon = require("sinon");
const SearchService = require("../../lib/services/search");

describe("SearchService", () => {
  describe("getSitemapLinks", () => {
    it("should get sitemap links", done => {
      const mockSearch = sinon.fake.resolves({
        hits: { hits: [{ _source: { id: "a/b/c" } }] }
      });

      const searchService = new SearchService(mockSearch);

      searchService
        .getSitemapLinks(new Date(1491560202450))
        .then(actual => {
          expect(actual).to.eql(["https://www.artfully.london/event/a/b/c"]);
          done();
        })
        .catch(done);
    });
  });
});
