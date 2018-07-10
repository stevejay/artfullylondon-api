import * as queryFactory from "./query-factory";
import * as entityType from "../types/entity-type";
import * as searchIndexType from "../types/search-index-type";
import * as statusType from "../types/status-type";

describe("createAutocompleteSearch", () => {
  test.each([
    // single entity search
    [
      { term: "foo", entityType: entityType.TALENT },
      {
        index: searchIndexType.AUTOCOMPLETE,
        type: "doc",
        body: {
          size: 0,
          suggest: {
            [entityType.TALENT]: {
              completion: {
                contexts: { entityType: [entityType.TALENT] },
                field: "nameSuggest",
                fuzzy: false,
                size: 5
              },
              prefix: "foo"
            },
            [`${entityType.TALENT}_fuzzy`]: {
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
      { term: "foo" },
      {
        index: searchIndexType.AUTOCOMPLETE,
        type: "doc",
        body: {
          size: 0,
          suggest: {
            [entityType.TALENT]: {
              completion: {
                contexts: { entityType: [entityType.TALENT] },
                field: "nameSuggest",
                fuzzy: false,
                size: 3
              },
              prefix: "foo"
            },
            [`${entityType.TALENT}_fuzzy`]: {
              completion: {
                contexts: { entityType: [entityType.TALENT] },
                field: "nameSuggest",
                fuzzy: true,
                size: 3
              },
              prefix: "foo"
            },

            [entityType.VENUE]: {
              completion: {
                contexts: { entityType: [entityType.VENUE] },
                field: "nameSuggest",
                fuzzy: false,
                size: 3
              },
              prefix: "foo"
            },
            [`${entityType.VENUE}_fuzzy`]: {
              completion: {
                contexts: { entityType: [entityType.VENUE] },
                field: "nameSuggest",
                fuzzy: true,
                size: 3
              },
              prefix: "foo"
            },

            [entityType.EVENT]: {
              completion: {
                contexts: { entityType: [entityType.EVENT] },
                field: "nameSuggest",
                fuzzy: false,
                size: 3
              },
              prefix: "foo"
            },
            [`${entityType.EVENT}_fuzzy`]: {
              completion: {
                contexts: { entityType: [entityType.EVENT] },
                field: "nameSuggest",
                fuzzy: true,
                size: 3
              },
              prefix: "foo"
            },

            [entityType.EVENT_SERIES]: {
              completion: {
                contexts: { entityType: [entityType.EVENT_SERIES] },
                field: "nameSuggest",
                fuzzy: false,
                size: 3
              },
              prefix: "foo"
            },
            [`${entityType.EVENT_SERIES}_fuzzy`]: {
              completion: {
                contexts: { entityType: [entityType.EVENT_SERIES] },
                field: "nameSuggest",
                fuzzy: true,
                size: 3
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
