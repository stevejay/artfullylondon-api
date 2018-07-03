import request from "request-promise-native";
import * as elasticsearch from "../utils/elasticsearch";
import * as searchIndexType from "../../src/types/search-index-type";
import * as entityType from "../../src/types/entity-type";
import * as statusType from "../../src/types/status-type";
import * as venueType from "../../src/types/venue-type";
jest.setTimeout(60000);

const AUTOCOMPLETE_QUERY = `
  query Autocomplete($term: String!, $entityType: EntityTypeEnum) {
    autocompleteSearch(term: $term, entityType: $entityType) {
      results {
        id
        entityType
        status
        name
        ... on AutocompleteVenue {
          postcode
        }
      }
    }
  }
`;

describe("autocomplete search", () => {
  beforeAll(async () => {
    await elasticsearch.createIndex(searchIndexType.AUTOCOMPLETE);
    await elasticsearch.indexDocument(searchIndexType.AUTOCOMPLETE, {
      status: statusType.ACTIVE,
      entityType: entityType.TALENT,
      id: "talent/1",
      nameSuggest: "Carrie Cracknell",
      output: "Carrie Cracknell",
      commonRole: "Director"
    });
    await elasticsearch.indexDocument(searchIndexType.AUTOCOMPLETE, {
      status: statusType.ACTIVE,
      entityType: entityType.TALENT,
      id: "talent/2",
      nameSuggest: "Dave Donnelly",
      output: "Dave Donnelly",
      commonRole: "Actor"
    });
    await elasticsearch.indexDocument(searchIndexType.AUTOCOMPLETE, {
      status: statusType.ACTIVE,
      entityType: entityType.VENUE,
      id: "venue/1",
      nameSuggest: "Carrillion Theatre",
      output: "Carrillion Theatre",
      venueType: venueType.THEATRE,
      address: "59 Some St",
      postcode: "N6 2AA"
    });
  });

  afterAll(async () => {
    await elasticsearch.deleteIndex(searchIndexType.AUTOCOMPLETE);
  });

  it("should perform a search of talents", async () => {
    const result = await request({
      uri: "http://localhost:3013/graphql",
      json: true,
      method: "POST",
      body: {
        query: AUTOCOMPLETE_QUERY,
        variables: { term: "car", entityType: entityType.TALENT }
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
        autocompleteSearch: {
          results: [
            {
              entityType: entityType.TALENT,
              id: "talent/1",
              name: "Carrie Cracknell",
              status: statusType.ACTIVE
            }
          ]
        }
      }
    });
  });

  it("should perform a search of talents when there are no matches", async () => {
    const result = await request({
      uri: "http://localhost:3013/graphql",
      json: true,
      method: "POST",
      body: {
        query: AUTOCOMPLETE_QUERY,
        variables: { term: "foo", entityType: entityType.TALENT }
      },
      timeout: 30000
    });

    expect(result).toEqual({
      data: {
        autocompleteSearch: {
          results: []
        }
      }
    });
  });

  it("should perform a search of everything", async () => {
    const result = await request({
      uri: "http://localhost:3013/graphql",
      json: true,
      method: "POST",
      body: {
        query: AUTOCOMPLETE_QUERY,
        variables: { term: "car" }
      },
      timeout: 30000
    });

    expect(result).toEqual({
      data: {
        autocompleteSearch: {
          results: [
            {
              entityType: entityType.TALENT,
              id: "talent/1",
              name: "Carrie Cracknell",
              status: statusType.ACTIVE
            },
            {
              status: statusType.ACTIVE,
              entityType: entityType.VENUE,
              id: "venue/1",
              name: "Carrillion Theatre",
              postcode: "N6 2AA"
            }
          ]
        }
      }
    });
  });
});
