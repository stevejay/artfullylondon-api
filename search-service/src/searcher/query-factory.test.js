import * as queryFactory from "./query-factory";
import * as entityType from "../types/entity-type";
import * as searchIndexType from "../types/search-index-type";
import * as occurrenceType from "../types/occurrence-type";
import * as statusType from "../types/status-type";

const BASIC_SEARCH_SOURCE = [
  "entityType",
  "id",
  "status",
  "image",
  "imageCopyright",
  "imageRatio",
  "imageColor",
  "name",
  "firstNames",
  "lastName",
  "talentType",
  "commonRole",
  "venueType",
  "address",
  "postcode",
  "latitude",
  "longitude",
  "eventSeriesType",
  "occurrence",
  "summary",
  "eventType",
  "occurrenceType",
  "costType",
  "venueId",
  "venueName",
  "dateFrom",
  "dateTo"
];

const BASIC_SEARCH_SORT = [
  { _score: "desc" },
  "lastName_sort",
  "firstNames.sort",
  "name_sort",
  "id"
];

const EVENT_ADVANCED_SEARCH_SORT = [{ _score: "desc" }, "name_sort", "id"];

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

describe("createEntityCountSearch", () => {
  it("should create the search", () => {
    const search = queryFactory.createEntityCountSearch();

    expect(search).toEqual({
      index: searchIndexType.ENTITY,
      type: "doc",
      body: {
        size: 0,
        aggs: {
          [entityType.EVENT]: {
            filter: { term: { entityType: entityType.EVENT } }
          },
          [entityType.EVENT_SERIES]: {
            filter: { term: { entityType: entityType.EVENT_SERIES } }
          },
          [entityType.VENUE]: {
            filter: { term: { entityType: entityType.VENUE } }
          },
          [entityType.TALENT]: {
            filter: { term: { entityType: entityType.TALENT } }
          }
        }
      }
    });
  });
});

describe("createBasicSearch", () => {
  it("should create a minimal all search", () => {
    const after = [0.65, "cracknell", "carrie", "carrie cracknell", "1234"];

    const search = queryFactory.createBasicSearch({
      hasLocation: false,
      after,
      first: 20
    });

    expect(search).toEqual({
      index: searchIndexType.ENTITY,
      type: "doc",
      body: {
        size: 20,
        _source: BASIC_SEARCH_SOURCE,
        sort: BASIC_SEARCH_SORT,
        search_after: after,
        query: { bool: {} }
      }
    });
  });

  it("should create a minimal talent search", () => {
    const after = [0.65, "cracknell", "carrie", "carrie cracknell", "1234"];

    const search = queryFactory.createBasicSearch({
      entityType: entityType.TALENT,
      hasLocation: false,
      after,
      first: 20
    });

    expect(search).toEqual({
      index: searchIndexType.ENTITY,
      type: "doc",
      body: {
        size: 20,
        _source: BASIC_SEARCH_SOURCE,
        sort: BASIC_SEARCH_SORT,
        search_after: after,
        query: {
          bool: {
            filter: { term: { entityType: entityType.TALENT } }
          }
        }
      }
    });
  });

  it("should create a maximal talent search", () => {
    const after = [0.65, "cracknell", "carrie", "carrie cracknell", "1234"];

    const search = queryFactory.createBasicSearch({
      entityType: entityType.TALENT,
      status: statusType.ACTIVE,
      term: "foo",
      hasLocation: false,
      after,
      first: 20
    });

    expect(search).toEqual({
      index: searchIndexType.ENTITY,
      type: "doc",
      body: {
        size: 20,
        _source: BASIC_SEARCH_SOURCE,
        sort: BASIC_SEARCH_SORT,
        search_after: after,
        query: {
          bool: {
            must: {
              bool: {
                should: [
                  {
                    multi_match: {
                      query: "foo",
                      fields: ["firstNames", "lastName"],
                      type: "cross_fields"
                    }
                  },
                  {
                    match: {
                      name: "foo"
                    }
                  },
                  {
                    match: {
                      venueName: "foo"
                    }
                  }
                ],
                minimum_should_match: 1
              }
            },
            filter: [
              { term: { status: statusType.ACTIVE } },
              { term: { entityType: entityType.TALENT } }
            ]
          }
        }
      }
    });
  });

  it("should create a maximal venue search", () => {
    const after = [0.65, "cracknell", "carrie", "carrie cracknell", "1234"];

    const search = queryFactory.createBasicSearch({
      entityType: entityType.VENUE,
      status: statusType.ACTIVE,
      term: "foo",
      north: 1,
      south: 2,
      east: 3,
      west: 4,
      hasLocation: true,
      after,
      first: 20
    });

    expect(search).toEqual({
      index: searchIndexType.ENTITY,
      type: "doc",
      body: {
        size: 20,
        _source: BASIC_SEARCH_SOURCE,
        sort: BASIC_SEARCH_SORT,
        search_after: after,
        query: {
          bool: {
            must: {
              bool: {
                should: [
                  {
                    multi_match: {
                      query: "foo",
                      fields: ["firstNames", "lastName"],
                      type: "cross_fields"
                    }
                  },
                  {
                    match: {
                      name: "foo"
                    }
                  },
                  {
                    match: {
                      venueName: "foo"
                    }
                  }
                ],
                minimum_should_match: 1
              }
            },
            filter: [
              { term: { status: statusType.ACTIVE } },
              { term: { entityType: entityType.VENUE } },
              {
                geo_bounding_box: {
                  locationOptimized: {
                    top_left: {
                      lat: 1,
                      lon: 4
                    },
                    bottom_right: {
                      lat: 2,
                      lon: 3
                    }
                  },
                  type: "indexed"
                }
              }
            ]
          }
        }
      }
    });
  });
});

describe("createEventAdvancedSearch", () => {
  it("should create a minimal search", () => {
    const after = [0.65, "carrie cracknell", "1234"];

    const search = queryFactory.createEventAdvancedSearch({
      hasLocation: false,
      after,
      first: 20
    });

    expect(search).toEqual({
      index: searchIndexType.ENTITY,
      type: "doc",
      body: {
        size: 20,
        _source: [
          "entityType",
          "id",
          "status",
          "image",
          "imageCopyright",
          "imageRatio",
          "imageColor",
          "name",
          "eventType",
          "occurrenceType",
          "costType",
          "summary",
          "venueId",
          "venueName",
          "postcode",
          "latitude",
          "longitude",
          "dateFrom",
          "dateTo"
        ],
        sort: EVENT_ADVANCED_SEARCH_SORT,
        search_after: after,
        query: {
          bool: {
            filter: { term: { entityType: entityType.EVENT } }
          }
        }
      }
    });
  });
});

describe("createSitemapEventSearch", () => {
  const result = queryFactory.createSitemapEventSearch({
    dateTo: "2017-01-18"
  });
  expect(result).toEqual({
    index: searchIndexType.ENTITY,
    type: "doc",
    body: {
      size: 5000,
      from: 0,
      _source: ["id"],
      query: {
        bool: {
          filter: [
            { term: { entityType: entityType.EVENT } },
            { term: { status: statusType.ACTIVE } }
          ],
          should: [
            { term: { occurrenceType: occurrenceType.CONTINUOUS } },
            { range: { dateTo: { gte: "2017-01-18" } } }
          ],
          minimum_should_match: 1
        }
      }
    }
  });
});
