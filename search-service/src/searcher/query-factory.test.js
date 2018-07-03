import * as queryFactory from "./query-factory";
import * as entityType from "../types/entity-type";
import * as searchIndexType from "../types/search-index-type";
import * as statusType from "../types/status-type";

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
      { term: "foo", singleEntitySearch: false },
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

describe("createEntityCountSearches", () => {
  it("should create the searches", () => {
    const countSearch = { query: { match_all: {} }, from: 0, size: 0 };
    const searches = queryFactory.createEntityCountSearches();

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
      hasLocation: false,
      after: [0.65, "cracknell", "carrie"],
      first: 20
    });

    expect(searches).toEqual([
      { index: searchIndexType.TALENT, type: "doc" },
      {
        size: 20,
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
        sort: [{ _score: "desc" }, "lastName_sort", "firstNames.sort", "id"],
        search_after: [0.65, "cracknell", "carrie"],
        query: { bool: {} }
      }
    ]);
  });

  it("should create a maximal talent search", () => {
    const searches = queryFactory.createBasicSearchSearches({
      entityType: entityType.TALENT,
      status: statusType.ACTIVE,
      term: "foo",
      hasTerm: true,
      hasLocation: false,
      after: [0.65, "cracknell", "carrie"],
      first: 20
    });

    expect(searches).toEqual([
      { index: searchIndexType.TALENT, type: "doc" },
      {
        size: 20,
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
        sort: [{ _score: "desc" }, "lastName_sort", "firstNames.sort", "id"],
        search_after: [0.65, "cracknell", "carrie"],
        query: {
          bool: {
            must: {
              multi_match: {
                query: "foo",
                fields: ["firstNames", "lastName"],
                type: "cross_fields"
              }
            },
            filter: { term: { status: statusType.ACTIVE } }
          }
        }
      }
    ]);
  });
});
