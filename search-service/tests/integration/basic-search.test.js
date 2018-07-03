import request from "request-promise-native";
import * as elasticsearch from "../utils/elasticsearch";
import * as searchIndexType from "../../src/types/search-index-type";
import * as entityType from "../../src/types/entity-type";
import * as statusType from "../../src/types/status-type";
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

    await elasticsearch.indexDocument(searchIndexType.TALENT, {
      status: statusType.ACTIVE,
      id: "talent/1",
      commonRole: "Director",
      entityType: entityType.TALENT,
      firstNames: "Carrie",
      lastName: "Cracknell",
      lastName_sort: "cracknell"
    });
    await elasticsearch.indexDocument(searchIndexType.TALENT, {
      status: statusType.ACTIVE,
      id: "talent/2",
      commonRole: "Actor",
      entityType: entityType.TALENT,
      firstNames: "Dave",
      lastName: "Donnelly",
      lastName_sort: "donnelly"
    });

    await elasticsearch.indexDocument(searchIndexType.VENUE, {
      status: statusType.ACTIVE,
      id: "venue/1",
      entityType: entityType.VENUE,
      name: "Almeida Theatre"
    });
    await elasticsearch.indexDocument(searchIndexType.VENUE, {
      status: statusType.DELETED,
      id: "venue/2",
      entityType: entityType.VENUE,
      name: "Arcola Theatre",
      latitude: 1,
      longitude: 2,
      locationOptimized: {
        lat: 1,
        lon: 2
      }
    });

    await elasticsearch.indexDocument(searchIndexType.EVENT_SERIES, {
      status: statusType.ACTIVE,
      id: "event-series/1",
      entityType: entityType.EVENT_SERIES,
      name: "Bang Said the Gun"
    });

    await elasticsearch.indexDocument(searchIndexType.EVENT, {
      status: statusType.ACTIVE,
      id: "event/1",
      entityType: entityType.EVENT,
      name: "Andy Warhol: New York Start"
    });
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
              cursor: expect.stringContaining("talent/1"),
              node: {
                entityType: "TALENT",
                id: "talent/1",
                status: "ACTIVE",
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

  it("should perform an admin search of venues", async () => {
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
              cursor: expect.stringContaining("venue/1"),
              node: {
                entityType: entityType.VENUE,
                id: "venue/1",
                status: statusType.ACTIVE
              }
            },
            {
              cursor: expect.stringContaining("venue/2"),
              node: {
                entityType: entityType.VENUE,
                id: "venue/2",
                status: statusType.DELETED
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
              cursor: expect.stringContaining("venue/2"),
              node: {
                entityType: entityType.VENUE,
                id: "venue/2",
                status: statusType.DELETED
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
              cursor: expect.stringContaining("venue/1"),
              node: {
                entityType: entityType.VENUE,
                id: "venue/1",
                status: statusType.ACTIVE
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

  it("should perform a admin location search of venues", async () => {
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
              cursor: expect.stringContaining("venue/2"),
              node: {
                entityType: entityType.VENUE,
                id: "venue/2",
                status: statusType.DELETED
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
              cursor: expect.stringContaining("event-series/1"),
              node: {
                entityType: entityType.EVENT_SERIES,
                id: "event-series/1",
                status: statusType.ACTIVE
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
              cursor: expect.stringContaining("event/1"),
              node: {
                entityType: entityType.EVENT,
                id: "event/1",
                status: statusType.ACTIVE
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
