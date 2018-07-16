import request from "request-promise-native";
import _ from "lodash";
import * as elasticsearch from "../utils/elasticsearch";
import * as searchIndexType from "../../src/types/search-index-type";
import * as statusType from "../../src/types/status-type";
import * as testData from "../test-data";
jest.setTimeout(60000);

const EVENT_ADVANCED_SEARCH_QUERY = `
  query EventAdvancedSearch(
    $term: String,
    $status: StatusTypeEnum,
    $area: AreaTypeEnum,
    $costType: CostTypeEnum,
    $bookingType: BookingTypeEnum,
    $venueId: ID,
    $talentId: ID,
    $eventSeriesId: ID,
    $externalEventIds: [ID!],
    $medium: String,
    $style: String,
    $audience: String,
    $dateFrom: IsoShortDate,
    $dateTo: IsoShortDate,
    $timeFrom: ShortTime,
    $timeTo: ShortTime,
    $north: Float,
    $south: Float,
    $east: Float,
    $west: Float,
    $first: Int,
    $after: String) {
    eventAdvancedSearch(
      term: $term,
      status: $status,
      area: $area,
      costType: $costType,
      bookingType: $bookingType,
      venueId: $venueId,
      talentId: $talentId,
      eventSeriesId: $eventSeriesId,
      externalEventIds: $externalEventIds,
      medium: $medium,
      style: $style,
      audience: $audience,
      dateFrom: $dateFrom,
      dateTo: $dateTo,
      timeFrom: $timeFrom,
      timeTo: $timeTo,
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
        }
        cursor
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

describe("event advanced search", () => {
  beforeAll(async () => {
    await elasticsearch.createIndex(searchIndexType.ENTITY);
    await elasticsearch.indexDocument(
      searchIndexType.ENTITY,
      testData.EVENT_ACTIVE_ANDY_WARHOL_EXHIBITION
    );
    await elasticsearch.indexDocument(
      searchIndexType.ENTITY,
      testData.EVENT_ACTIVE_BRITISH_MUSEUM_PERM_COLL
    );
  });

  afterAll(async () => {
    await elasticsearch.deleteIndex(searchIndexType.ENTITY);
  });

  it("should perform a public search", async () => {
    const result = await request({
      uri: "http://localhost:3013/graphql",
      json: true,
      method: "POST",
      body: {
        query: EVENT_ADVANCED_SEARCH_QUERY,
        variables: {
          term: "andy",
          status: statusType.ACTIVE,
          first: 12
        }
      },
      timeout: 30000
    });

    expect(result).toEqual({
      data: {
        eventAdvancedSearch: {
          edges: [
            {
              cursor: expect.stringContaining(
                testData.EVENT_ACTIVE_ANDY_WARHOL_EXHIBITION.id
              ),
              node: {
                ..._.pick(testData.EVENT_ACTIVE_ANDY_WARHOL_EXHIBITION, [
                  "entityType",
                  "id",
                  "name",
                  "status"
                ])
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

  it("should perform an events by external event ids search", async () => {
    const result = await request({
      uri: "http://localhost:3013/graphql",
      json: true,
      method: "POST",
      body: {
        query: EVENT_ADVANCED_SEARCH_QUERY,
        variables: {
          externalEventIds: ["foo", "bar"],
          first: 1000
        }
      },
      timeout: 30000
    });

    expect(result).toEqual({
      data: {
        eventAdvancedSearch: {
          edges: [],
          pageInfo: {
            hasNextPage: false
          }
        }
      }
    });
  });
});
