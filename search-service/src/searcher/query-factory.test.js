import * as queryFactory from "./query-factory";
import * as entityType from "../types/entity-type";
import * as searchIndexType from "../types/search-index-type";

describe("createAutocompleteSearch", () => {
  test.each([
    // single entity search
    [
      { term: "foo", entityType: entityType.TALENT, singleEntitySearch: true },
      {
        index: searchIndexType.AUTOCOMPLETE,
        type: "doc",
        body: {
          size: 0,
          suggest: {
            autocomplete: {
              completion: {
                contexts: { entityType: [entityType.TALENT] },
                field: "nameSuggest",
                size: 5
              },
              prefix: "foo"
            },
            fuzzyAutocomplete: {
              completion: {
                contexts: { entityType: [entityType.TALENT] },
                field: "nameSuggest",
                fuzzy: true,
                size: 5
              },
              prefix: "foo"
            }
          }
        }
      }
    ],
    // multiple entity search
    [
      { term: "foo", entityType: entityType.ALL, singleEntitySearch: false },
      {
        index: searchIndexType.AUTOCOMPLETE,
        type: "doc",
        body: {
          size: 0,
          suggest: {
            autocomplete: {
              completion: {
                field: "nameSuggest",
                size: 5
              },
              prefix: "foo"
            },
            fuzzyAutocomplete: {
              completion: {
                field: "nameSuggest",
                fuzzy: true,
                size: 5
              },
              prefix: "foo"
            }
          }
        }
      }
    ]
  ])("%o should create search %o", (params, expected) => {
    expect(queryFactory.createAutocompleteSearch(params)).toEqual(expected);
  });
});

describe("createEntityCountsSearches", () => {
  it("should create the searches", () => {
    const countSearch = { query: { match_all: {} }, from: 0, size: 0 };
    const searches = queryFactory.createEntityCountsSearches();

    expect(searches).toEqual([
      { index: searchIndexType.EVENT, type: "doc" },
      countSearch,
      { index: searchIndexType.EVENT_SERIES, type: "doc" },
      countSearch,
      { index: searchIndexType.TALENT, type: "doc" },
      countSearch,
      { index: searchIndexType.VENUE, type: "doc" },
      countSearch
    ]);
  });
});

describe("createBasicSearchSearches", () => {
  it("should create a minimal talent search", () => {
    const searches = queryFactory.createBasicSearchSearches({
      entityType: entityType.TALENT,
      hasTerm: false,
      isPublic: false,
      skip: 10,
      take: 20
    });

    expect(searches).toEqual([
      { index: searchIndexType.TALENT, type: "doc" },
      {
        size: 20,
        from: 10,
        _source: [
          "entityType",
          "id",
          "status",
          "image",
          "imageCopyright",
          "imageRatio",
          "imageColor",
          "firstNames",
          "lastName",
          "talentType",
          "commonRole"
        ],
        sort: [{ _score: "desc" }, "lastName_sort", "firstNames.sort"],
        query: { bool: {} }
      }
    ]);
  });

  it("should create a maximal talent search", () => {
    const searches = queryFactory.createBasicSearchSearches({
      entityType: entityType.TALENT,
      term: "foo",
      hasTerm: true,
      isPublic: true,
      skip: 10,
      take: 20
    });

    expect(searches).toEqual([
      { index: searchIndexType.TALENT, type: "doc" },
      {
        size: 20,
        from: 10,
        _source: [
          "entityType",
          "id",
          "status",
          "image",
          "imageCopyright",
          "imageRatio",
          "imageColor",
          "firstNames",
          "lastName",
          "talentType",
          "commonRole"
        ],
        sort: [{ _score: "desc" }, "lastName_sort", "firstNames.sort"],
        query: {
          bool: {
            must: {
              multi_match: {
                query: "foo",
                fields: ["firstNames", "lastName"],
                type: "cross_fields"
              }
            },
            filter: { term: { status: "Active" } }
          }
        }
      }
    ]);
  });
});
