import request from "request-promise-native";
import * as elasticsearch from "../utils/elasticsearch";
import * as searchIndexType from "../../src/types/search-index-type";
import * as entityType from "../../src/types/entity-type";
import * as statusType from "../../src/types/status-type";
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
    await elasticsearch.createIndex(searchIndexType.EVENT);
    await elasticsearch.indexDocument(searchIndexType.EVENT, {
      status: statusType.ACTIVE,
      id: "event/1",
      entityType: entityType.EVENT,
      name: "Foo"
    });
    await elasticsearch.indexDocument(searchIndexType.EVENT, {
      status: statusType.ACTIVE,
      id: "event/2",
      entityType: entityType.EVENT,
      name: "Bar"
    });
  });

  afterAll(async () => {
    await elasticsearch.deleteIndex(searchIndexType.EVENT);
  });

  it("should perform a public search", async () => {
    const result = await request({
      uri: "http://localhost:3013/graphql",
      json: true,
      method: "POST",
      body: {
        query: EVENT_ADVANCED_SEARCH_QUERY,
        variables: {
          term: "foo",
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
              cursor: expect.stringContaining("event/1"),
              node: {
                entityType: entityType.EVENT,
                id: "event/1",
                name: "Foo",
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
