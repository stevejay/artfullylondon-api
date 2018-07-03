import request from "request-promise-native";
import * as elasticsearch from "../utils/elasticsearch";
import * as testData from "./test-data";
import * as searchIndexType from "../../src/types/search-index-type";
import * as entityType from "../../src/types/entity-type";
jest.setTimeout(60000);

const ENTITY_COUNT_QUERY = `
  query EntityCount {
    entityCount {
      results {
        entityType
        count
      }
    }
  }
`;

const SITEMAP_EVENT_QUERY = `
  query SitemapEvent {
    sitemapEvent {
      results {
        id
      }
    }
  }
`;

const FEATURED_EVENTS_QUERY = `
  query FeaturedEvents($first: Int, $after: String) {
    featuredEvents(first: $first, after: $after) {
      edges {
        node {
          id
          status
          name
        }
        cursor
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

describe("preset search", () => {
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

    await elasticsearch.indexDocument(
      searchIndexType.EVENT,
      testData.EVENT_ACTIVE_BRITISH_MUSEUM_PERM_COLL
    );
  });

  afterAll(async () => {
    await elasticsearch.deleteIndex(searchIndexType.TALENT);
    await elasticsearch.deleteIndex(searchIndexType.VENUE);
    await elasticsearch.deleteIndex(searchIndexType.EVENT);
    await elasticsearch.deleteIndex(searchIndexType.EVENT_SERIES);
  });

  it("should perform an entity count preset search", async () => {
    const result = await request({
      uri: "http://localhost:3013/graphql",
      json: true,
      method: "POST",
      body: { query: ENTITY_COUNT_QUERY },
      timeout: 30000
    });

    expect(result).toEqual({
      data: {
        entityCount: {
          results: [
            {
              count: 2,
              entityType: entityType.EVENT
            },
            {
              count: 1,
              entityType: entityType.EVENT_SERIES
            },
            {
              count: 2,
              entityType: entityType.TALENT
            },
            {
              count: 2,
              entityType: entityType.VENUE
            }
          ]
        }
      }
    });
  });

  it("should perform a sitemap event ids preset search", async () => {
    const result = await request({
      uri: "http://localhost:3013/graphql",
      json: true,
      method: "POST",
      body: { query: SITEMAP_EVENT_QUERY },
      timeout: 30000
    });

    expect(result).toEqual({
      data: {
        sitemapEvent: {
          results: [
            {
              id: "event/andy-warhol-exhibition"
            },
            {
              id: "event/british-museum-perm"
            }
          ]
        }
      }
    });
  });

  it("should perform a featured events preset search", async () => {
    const result = await request({
      uri: "http://localhost:3013/graphql",
      json: true,
      method: "POST",
      body: {
        query: FEATURED_EVENTS_QUERY,
        variables: {
          first: 20
        }
      },
      timeout: 30000
    });

    expect(result).toEqual({
      data: {
        featuredEvents: {
          edges: [],
          pageInfo: {
            hasNextPage: false
          }
        }
      }
    });
  });
});
