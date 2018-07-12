import request from "request-promise-native";
import * as elasticsearch from "../utils/elasticsearch";
import * as searchIndexType from "../../src/types/search-index-type";
import * as entityType from "../../src/types/entity-type";
import * as statusType from "../../src/types/status-type";
import * as testData from "../test-data";
jest.setTimeout(60000);

const BASIC_SEARCH_QUERY = `
  query BasicSearch(
    $term: String,
    $entityType: EntityTypeEnum,
    $status: StatusTypeEnum, 
    $north: Float,
    $south: Float,
    $east: Float,
    $west: Float,
    $first: Int,
    $after: String) {
    basicSearch(
      term: $term,
      entityType: $entityType,
      status: $status,
      north: $north,
      south: $south,
      east: $east,
      west: $west,
      first: $first,
      after: $after) {
      edges {
        node {
          id
          entityType
          status
          name
          ... on Talent {
            commonRole
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

describe("basic search", () => {
  beforeAll(async () => {
    await elasticsearch.createIndex(searchIndexType.TALENT);
    await elasticsearch.createIndex(searchIndexType.VENUE);
    await elasticsearch.createIndex(searchIndexType.EVENT);
    await elasticsearch.createIndex(searchIndexType.EVENT_SERIES);
    await elasticsearch.indexDocument(
      searchIndexType.TALENT,
      testData.TALENT_ACTIVE_CARRIE_CRACKNELL
    );
    await elasticsearch.indexDocument(
      searchIndexType.TALENT,
      testData.TALENT_ACTIVE_DAVE_DONNELLY
    );
    await elasticsearch.indexDocument(
      searchIndexType.VENUE,
      testData.VENUE_ACTIVE_ALMEIDA_THEATRE
    );
    await elasticsearch.indexDocument(
      searchIndexType.VENUE,
      testData.VENUE_DELETED_ARCOLA_THEATRE
    );
    await elasticsearch.indexDocument(
      searchIndexType.EVENT_SERIES,
      testData.EVENT_SERIES_ACTIVE_BANG_SAID_THE_GUN
    );
    await elasticsearch.indexDocument(
      searchIndexType.EVENT,
      testData.EVENT_ACTIVE_ANDY_WARHOL_EXHIBITION
    );
  });

  afterAll(async () => {
    await elasticsearch.deleteIndex(searchIndexType.TALENT);
    await elasticsearch.deleteIndex(searchIndexType.VENUE);
    await elasticsearch.deleteIndex(searchIndexType.EVENT);
    await elasticsearch.deleteIndex(searchIndexType.EVENT_SERIES);
  });

  it("should perform a search of talents", async () => {
    let result = await request({
      uri: "http://localhost:3013/graphql",
      json: true,
      method: "POST",
      body: {
        query: BASIC_SEARCH_QUERY,
        variables: { term: "carrie", entityType: entityType.TALENT, first: 1 }
      },
      timeout: 30000,
      resolveWithFullResponse: true
    });

    expect(result.headers).toEqual(
      expect.objectContaining({
        "access-control-allow-credentials": "true",
        "access-control-allow-origin": "*"
      })
    );

    expect(result.body).toEqual({
      data: {
        basicSearch: {
          edges: [
            {
              cursor: expect.stringContaining(
                testData.TALENT_ACTIVE_CARRIE_CRACKNELL.id
              ),
              node: {
                entityType: entityType.TALENT,
                id: testData.TALENT_ACTIVE_CARRIE_CRACKNELL.id,
                status: statusType.ACTIVE,
                name: "Carrie Cracknell",
                commonRole: "Director"
              }
            }
          ],
          pageInfo: {
            hasNextPage: true
          }
        }
      }
    });

    result = await request({
      uri: "http://localhost:3013/graphql",
      json: true,
      method: "POST",
      body: {
        query: BASIC_SEARCH_QUERY,
        variables: {
          term: "carrie",
          entityType: entityType.TALENT,
          first: 12,
          after: result.body.data.basicSearch.edges[0].cursor
        }
      },
      timeout: 30000
    });

    expect(result).toEqual({
      data: {
        basicSearch: {
          edges: [],
          pageInfo: {
            hasNextPage: false
          }
        }
      }
    });
  });

  it("should perform a paged admin search of venues", async () => {
    let result = await request({
      uri: "http://localhost:3013/graphql",
      json: true,
      method: "POST",
      body: {
        query: BASIC_SEARCH_QUERY,
        variables: {
          term: "theatre",
          entityType: entityType.VENUE,
          first: 12
        }
      },
      timeout: 30000
    });

    expect(result).toEqual({
      data: {
        basicSearch: {
          edges: [
            {
              cursor: expect.stringContaining(
                testData.VENUE_ACTIVE_ALMEIDA_THEATRE.id
              ),
              node: {
                entityType: entityType.VENUE,
                id: testData.VENUE_ACTIVE_ALMEIDA_THEATRE.id,
                status: statusType.ACTIVE,
                name: testData.VENUE_ACTIVE_ALMEIDA_THEATRE.name
              }
            },
            {
              cursor: expect.stringContaining(
                testData.VENUE_DELETED_ARCOLA_THEATRE.id
              ),
              node: {
                entityType: entityType.VENUE,
                id: testData.VENUE_DELETED_ARCOLA_THEATRE.id,
                status: statusType.DELETED,
                name: testData.VENUE_DELETED_ARCOLA_THEATRE.name
              }
            }
          ],
          pageInfo: {
            hasNextPage: false
          }
        }
      }
    });

    result = await request({
      uri: "http://localhost:3013/graphql",
      json: true,
      method: "POST",
      body: {
        query: BASIC_SEARCH_QUERY,
        variables: {
          term: "theatre",
          entityType: entityType.VENUE,
          first: 1,
          after: result.data.basicSearch.edges[0].cursor
        }
      },
      timeout: 30000
    });

    expect(result).toEqual({
      data: {
        basicSearch: {
          edges: [
            {
              cursor: expect.stringContaining(
                testData.VENUE_DELETED_ARCOLA_THEATRE.id
              ),
              node: {
                entityType: entityType.VENUE,
                id: testData.VENUE_DELETED_ARCOLA_THEATRE.id,
                status: statusType.DELETED,
                name: testData.VENUE_DELETED_ARCOLA_THEATRE.name
              }
            }
          ],
          pageInfo: {
            hasNextPage: true
          }
        }
      }
    });
  });

  it("should perform a public search of all venues", async () => {
    const result = await request({
      uri: "http://localhost:3013/graphql",
      json: true,
      method: "POST",
      body: {
        query: BASIC_SEARCH_QUERY,
        variables: {
          term: "theatre",
          entityType: entityType.VENUE,
          status: statusType.ACTIVE,
          first: 12
        }
      },
      timeout: 30000
    });

    expect(result).toEqual({
      data: {
        basicSearch: {
          edges: [
            {
              cursor: expect.stringContaining(
                testData.VENUE_ACTIVE_ALMEIDA_THEATRE.id
              ),
              node: {
                entityType: entityType.VENUE,
                id: testData.VENUE_ACTIVE_ALMEIDA_THEATRE.id,
                status: statusType.ACTIVE,
                name: testData.VENUE_ACTIVE_ALMEIDA_THEATRE.name
              }
            }
          ],
          pageInfo: {
            hasNextPage: false
          }
        }
      }
    });
  });

  it("should perform an admin location search of venues", async () => {
    const result = await request({
      uri: "http://localhost:3013/graphql",
      json: true,
      method: "POST",
      body: {
        query: BASIC_SEARCH_QUERY,
        variables: {
          entityType: entityType.VENUE,
          north: 4,
          south: -4,
          east: 4,
          west: -4,
          first: 12
        }
      },
      timeout: 30000
    });

    expect(result).toEqual({
      data: {
        basicSearch: {
          edges: [
            {
              cursor: expect.stringContaining(
                testData.VENUE_DELETED_ARCOLA_THEATRE.id
              ),
              node: {
                entityType: entityType.VENUE,
                id: testData.VENUE_DELETED_ARCOLA_THEATRE.id,
                status: statusType.DELETED,
                name: testData.VENUE_DELETED_ARCOLA_THEATRE.name
              }
            }
          ],
          pageInfo: {
            hasNextPage: false
          }
        }
      }
    });
  });

  it("should perform a public search of all event series", async () => {
    const result = await request({
      uri: "http://localhost:3013/graphql",
      json: true,
      method: "POST",
      body: {
        query: BASIC_SEARCH_QUERY,
        variables: {
          entityType: entityType.EVENT_SERIES,
          status: statusType.ACTIVE,
          first: 12
        }
      },
      timeout: 30000
    });

    expect(result).toEqual({
      data: {
        basicSearch: {
          edges: [
            {
              cursor: expect.stringContaining(
                testData.EVENT_SERIES_ACTIVE_BANG_SAID_THE_GUN.id
              ),
              node: {
                entityType: entityType.EVENT_SERIES,
                id: testData.EVENT_SERIES_ACTIVE_BANG_SAID_THE_GUN.id,
                status: statusType.ACTIVE,
                name: testData.EVENT_SERIES_ACTIVE_BANG_SAID_THE_GUN.name
              }
            }
          ],
          pageInfo: {
            hasNextPage: false
          }
        }
      }
    });
  });

  it("should perform a public search of all events", async () => {
    const result = await request({
      uri: "http://localhost:3013/graphql",
      json: true,
      method: "POST",
      body: {
        query: BASIC_SEARCH_QUERY,
        variables: {
          entityType: entityType.EVENT,
          status: statusType.ACTIVE,
          first: 12
        }
      },
      timeout: 30000
    });

    expect(result).toEqual({
      data: {
        basicSearch: {
          edges: [
            {
              cursor: expect.stringContaining(
                testData.EVENT_ACTIVE_ANDY_WARHOL_EXHIBITION.id
              ),
              node: {
                entityType: entityType.EVENT,
                id: testData.EVENT_ACTIVE_ANDY_WARHOL_EXHIBITION.id,
                status: statusType.ACTIVE,
                name: testData.EVENT_ACTIVE_ANDY_WARHOL_EXHIBITION.name
              }
            }
          ],
          pageInfo: {
            hasNextPage: false
          }
        }
      }
    });
  });
});
