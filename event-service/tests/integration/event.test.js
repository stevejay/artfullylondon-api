import request from "request-promise-native";
import delay from "delay";
import * as testData from "../utils/test-data";
import * as dynamodb from "../utils/dynamodb";
import SnsListener from "../utils/serverless-offline-sns-listener";
import * as costType from "../../src/types/cost-type";
import * as entityType from "../../src/types/entity-type";
import * as eventSeriesType from "../../src/types/event-series-type";
import * as eventType from "../../src/types/event-type";
import * as occurrenceType from "../../src/types/occurrence-type";
import * as statusType from "../../src/types/status-type";
import MockJwksServer from "../utils/mock-jwks-server";
import * as authUtils from "../utils/authentication";
jest.setTimeout(30000);

const EVENT_QUERY = `
  query GetEvent($id: ID!) {
    event(id: $id) {
      id
      name
      summary
    }
  }
`;

const EVENT_FOR_EDIT_QUERY = `
  query GetEventForEdit($id: ID!) {
    eventForEdit(id: $id) {
      id
      name
      summary
      version
    }
  }
`;

const CREATE_EVENT_MUTATION = `
  mutation CreateEvent(
    $status: StatusTypeEnum!
    $links: [LinkInput!]
    $images: [ImageInput!]
    $weSay: String
    $notes: String
    $description: String
    $descriptionCredit: String
    $name: String!
    $eventType: EventTypeEnum!
    $occurrenceType: OccurrenceTypeEnum!
    $costType: CostTypeEnum!
    $summary: String!
    $rating: Int!
    $bookingType: BookingTypeEnum!
    $venueId: ID!
    $eventSeriesId: ID
    $useVenueOpeningTimes: Boolean!
    $dateFrom: IsoShortDate
    $dateTo: IsoShortDate
    $costFrom: Float
    $costTo: Float
    $bookingOpens: IsoShortDate
    $venueGuidance: String
    $duration: ShortTime
    $minAge: Int
    $maxAge: Int
    $soldOut: Boolean
    $timedEntry: Boolean
    $timesRanges: [TimesRangeInput!]
    $performances: [DayPerformanceInput!]
    $additionalPerformances: [DatePerformanceInput!]
    $specialPerformances: [SpecialPerformanceInput!]
    $performancesClosures: [DateClosedTimeAtInput!]
    $soldOutPerformances: [DatePerformanceInput!]
    $openingTimes: [DayOpeningTimeInput!]
    $additionalOpeningTimes: [DateOpeningTimeInput!]
    $specialOpeningTimes: [SpecialOpeningTimeInput!]
    $openingTimesClosures: [DateClosedTimeRangeInput!]
    $audienceTags: [TagInput!]
    $mediumTags: [TagInput!]
    $styleTags: [TagInput!]
    $geoTags: [TagInput!]
    $talents: [EventTalentInput!]
    $reviews: [ReviewInput!]
  ) {
    createEvent(input: {
      status: $status
      links: $links
      images: $images
      weSay: $weSay
      notes: $notes
      description: $description
      descriptionCredit: $descriptionCredit
      name: $name
      eventType: $eventType
      occurrenceType: $occurrenceType
      costType: $costType
      summary: $summary
      rating: $rating
      bookingType: $bookingType
      venueId: $venueId
      eventSeriesId: $eventSeriesId
      useVenueOpeningTimes: $useVenueOpeningTimes
      dateFrom: $dateFrom
      dateTo: $dateTo
      costFrom: $costFrom
      costTo: $costTo
      bookingOpens: $bookingOpens
      venueGuidance: $venueGuidance
      duration: $duration
      minAge: $minAge
      maxAge: $maxAge
      soldOut: $soldOut
      timedEntry: $timedEntry
      timesRanges: $timesRanges
      performances: $performances
      additionalPerformances: $additionalPerformances
      specialPerformances: $specialPerformances
      performancesClosures: $performancesClosures
      soldOutPerformances: $soldOutPerformances
      openingTimes: $openingTimes
      additionalOpeningTimes: $additionalOpeningTimes
      specialOpeningTimes: $specialOpeningTimes
      openingTimesClosures: $openingTimesClosures
      audienceTags: $audienceTags
      mediumTags: $mediumTags
      styleTags: $styleTags
      geoTags: $geoTags
      talents: $talents
      reviews: $reviews
    }) {
      event {
        id
        name
        summary
      }
    }
  }
`;

const UPDATE_EVENT_MUTATION = `
  mutation UpdateEvent(
    $id: ID!
    $status: StatusTypeEnum!
    $version: Int!
    $links: [LinkInput!]
    $images: [ImageInput!]
    $weSay: String
    $notes: String
    $description: String
    $descriptionCredit: String
    $name: String!
    $eventType: EventTypeEnum!
    $occurrenceType: OccurrenceTypeEnum!
    $costType: CostTypeEnum!
    $summary: String!
    $rating: Int!
    $bookingType: BookingTypeEnum!
    $venueId: ID!
    $eventSeriesId: ID
    $useVenueOpeningTimes: Boolean!
    $dateFrom: IsoShortDate
    $dateTo: IsoShortDate
    $costFrom: Float
    $costTo: Float
    $bookingOpens: IsoShortDate
    $venueGuidance: String
    $duration: ShortTime
    $minAge: Int
    $maxAge: Int
    $soldOut: Boolean
    $timedEntry: Boolean
    $timesRanges: [TimesRangeInput!]
    $performances: [DayPerformanceInput!]
    $additionalPerformances: [DatePerformanceInput!]
    $specialPerformances: [SpecialPerformanceInput!]
    $performancesClosures: [DateClosedTimeAtInput!]
    $soldOutPerformances: [DatePerformanceInput!]
    $openingTimes: [DayOpeningTimeInput!]
    $additionalOpeningTimes: [DateOpeningTimeInput!]
    $specialOpeningTimes: [SpecialOpeningTimeInput!]
    $openingTimesClosures: [DateClosedTimeRangeInput!]
    $audienceTags: [TagInput!]
    $mediumTags: [TagInput!]
    $styleTags: [TagInput!]
    $geoTags: [TagInput!]
    $talents: [EventTalentInput!]
    $reviews: [ReviewInput!]
  ) {
    updateEvent(input: {
      id: $id
      status: $status
      version: $version
      links: $links
      images: $images
      weSay: $weSay
      notes: $notes
      description: $description
      descriptionCredit: $descriptionCredit
      name: $name
      eventType: $eventType
      occurrenceType: $occurrenceType
      costType: $costType
      summary: $summary
      rating: $rating
      bookingType: $bookingType
      venueId: $venueId
      eventSeriesId: $eventSeriesId
      useVenueOpeningTimes: $useVenueOpeningTimes
      dateFrom: $dateFrom
      dateTo: $dateTo
      costFrom: $costFrom
      costTo: $costTo
      bookingOpens: $bookingOpens
      venueGuidance: $venueGuidance
      duration: $duration
      minAge: $minAge
      maxAge: $maxAge
      soldOut: $soldOut
      timedEntry: $timedEntry
      timesRanges: $timesRanges
      performances: $performances
      additionalPerformances: $additionalPerformances
      specialPerformances: $specialPerformances
      performancesClosures: $performancesClosures
      soldOutPerformances: $soldOutPerformances
      openingTimes: $openingTimes
      additionalOpeningTimes: $additionalOpeningTimes
      specialOpeningTimes: $specialOpeningTimes
      openingTimesClosures: $openingTimesClosures
      audienceTags: $audienceTags
      mediumTags: $mediumTags
      styleTags: $styleTags
      geoTags: $geoTags
      talents: $talents
      reviews: $reviews
    }) {
      event {
        id
        name
        summary
      }
    }
  }
`;

describe("event", () => {
  const mockJwksServer = new MockJwksServer();
  let testVenueId = null;
  let testTalentId = null;
  let testEventSeriesId = null;
  let testEventId = null;
  let snsListener = null;
  const testVenueBody = testData.createNewVenueBody();
  const testTalentBody = testData.createNewTalentBody();
  const testEventSeriesBody = testData.createNewEventSeriesBody();
  let testEventBody = null;

  beforeAll(async () => {
    snsListener = new SnsListener({
      endpoint: "http://127.0.0.1:4002",
      region: "eu-west-1"
    });
    await snsListener.startListening(
      "arn:aws:sns:eu-west-1:1111111111111:IndexDocument-development",
      3019
    );
    mockJwksServer.start(3021);
    await dynamodb.truncateAllTables();

    let response = await request({
      uri: "http://localhost:3014/admin/venue",
      json: true,
      method: "POST",
      headers: { Authorization: cognitoAuth.EDITOR_AUTH_TOKEN },
      body: testVenueBody,
      timeout: 14000
    });

    let parsedResponse = lambdaUtils.parseLambdaResponse(response);
    testVenueId = parsedResponse.entity.id;

    response = await request({
      uri: "http://localhost:3014/admin/talent",
      json: true,
      method: "POST",
      headers: { Authorization: cognitoAuth.EDITOR_AUTH_TOKEN },
      body: testTalentBody,
      timeout: 14000
    });

    parsedResponse = lambdaUtils.parseLambdaResponse(response);
    testTalentId = parsedResponse.entity.id;

    response = await request({
      uri: "http://localhost:3014/admin/event-series",
      json: true,
      method: "POST",
      headers: { Authorization: cognitoAuth.EDITOR_AUTH_TOKEN },
      body: testEventSeriesBody,
      timeout: 14000
    });

    parsedResponse = lambdaUtils.parseLambdaResponse(response);
    testEventSeriesId = parsedResponse.entity.id;

    testEventBody = testData.createNewEventBody(
      testVenueId,
      testTalentId,
      testEventSeriesId
    );
  });

  afterAll(async () => {
    mockJwksServer.stop();
    await snsListener.stopListening();
  });

  it("should fail to create an invalid event", async () => {
    expect(
      await sync(
        request({
          uri: "http://localhost:3014/admin/event",
          json: true,
          method: "POST",
          headers: { Authorization: cognitoAuth.EDITOR_AUTH_TOKEN },
          body: { status: statusType.ACTIVE },
          timeout: 14000
        })
      )
    ).toThrow(/Name can't be blank/);
  });

  it("should fail to create an event when the user is the readonly user", async () => {
    expect(
      await sync(
        request({
          uri: "http://localhost:3014/admin/event",
          json: true,
          method: "POST",
          headers: { Authorization: cognitoAuth.READONLY_AUTH_TOKEN },
          body: testEventBody,
          timeout: 14000
        })
      )
    ).toThrow(/readonly user cannot modify system/);
  });

  it("should create a valid event", async () => {
    snsListener.clearReceivedMessages();
    const response = await request({
      uri: "http://localhost:3014/admin/event",
      json: true,
      method: "POST",
      headers: { Authorization: cognitoAuth.EDITOR_AUTH_TOKEN },
      body: testEventBody,
      timeout: 14000
    });

    const parsedResponse = lambdaUtils.parseLambdaResponse(response);
    expect(parsedResponse.entity).toEqual(
      expect.objectContaining({
        eventType: eventType.EXHIBITION,
        occurrenceType: occurrenceType.BOUNDED,
        costType: costType.FREE,
        status: statusType.ACTIVE,
        version: 1
      })
    );

    expect(parsedResponse.entity.venue.id).toEqual(testVenueId);
    expect(parsedResponse.entity.talents[0].id).toEqual(testTalentId);
    expect(parsedResponse.entity.eventSeries.id).toEqual(testEventSeriesId);

    testEventId = parsedResponse.entity.id;

    // Allow time for the SNS search index update message to be processed.
    await delay(5000);
    expect(snsListener.receivedMessages).toEqual([
      {
        entityType: entityType.EVENT,
        entity: expect.objectContaining({
          eventType: eventType.EXHIBITION,
          occurrenceType: occurrenceType.BOUNDED,
          costType: costType.FREE,
          status: statusType.ACTIVE,
          version: 1
        })
      }
    ]);
  });

  it("should get the event without cache control headers when using the admin api", async () => {
    const response = await request({
      uri: "http://localhost:3014/admin/event/" + testEventId,
      json: true,
      method: "GET",
      timeout: 14000,
      resolveWithFullResponse: true
    });

    const parsedResponse = lambdaUtils.parseLambdaResponse(response.body);
    expect(parsedResponse.entity).toEqual(
      expect.objectContaining({
        id: testEventId,
        eventType: eventType.EXHIBITION,
        occurrenceType: occurrenceType.BOUNDED,
        costType: costType.FREE,
        status: statusType.ACTIVE,
        version: 1
      })
    );

    expect(parsedResponse.entity.venue.id).toEqual(testVenueId);
    expect(parsedResponse.entity.talents[0].id).toEqual(testTalentId);
    expect(parsedResponse.entity.eventSeries.id).toEqual(testEventSeriesId);
  });

  it("should get the event with cache control headers when using the public api", async () => {
    const response = await request({
      uri: "http://localhost:3014/public/event/" + testEventId,
      json: true,
      method: "GET",
      timeout: 14000,
      resolveWithFullResponse: true
    });

    const parsedResponse = lambdaUtils.parseLambdaResponse(response.body);
    expect(parsedResponse.entity).toEqual(
      expect.objectContaining({
        id: testEventId,
        eventType: eventType.EXHIBITION,
        occurrenceType: occurrenceType.BOUNDED,
        costType: costType.FREE,
        entityType: entityType.EVENT,
        status: statusType.ACTIVE
      })
    );

    expect(parsedResponse.entity.venue.id).toEqual(testVenueId);
    expect(parsedResponse.entity.talents[0].id).toEqual(testTalentId);
    expect(parsedResponse.entity.eventSeries.id).toEqual(testEventSeriesId);
  });

  it("should get the event using the get multi endpoint", async () => {
    const response = await request({
      uri:
        "http://localhost:3014/public/event?ids=" +
        encodeURIComponent(testEventId),
      json: true,
      method: "GET",
      timeout: 14000
    });

    const parsedResponse = lambdaUtils.parseLambdaResponse(response);
    expect(parsedResponse.entities.length).toEqual(1);
    expect(parsedResponse.entities[0]).toEqual(
      expect.objectContaining({
        id: testEventId,
        eventType: eventType.EXHIBITION,
        occurrenceType: occurrenceType.BOUNDED,
        costType: costType.FREE,
        entityType: entityType.EVENT,
        status: statusType.ACTIVE
      })
    );

    expect(parsedResponse.entities[0].venueId).toEqual(testVenueId);
  });

  it("should reject a stale update to the event", async () => {
    expect(
      await sync(
        request({
          uri: "http://localhost:3014/admin/event/" + testEventId,
          json: true,
          method: "PUT",
          headers: { Authorization: cognitoAuth.EDITOR_AUTH_TOKEN },
          body: testEventBody,
          timeout: 14000
        })
      )
    ).toThrow(/Stale Data/);
  });

  it("should accept a valid update to the event", async () => {
    snsListener.clearReceivedMessages();
    const response = await request({
      uri: "http://localhost:3014/admin/event/" + testEventId,
      json: true,
      method: "PUT",
      headers: { Authorization: cognitoAuth.EDITOR_AUTH_TOKEN },
      body: {
        ...testEventBody,
        duration: "02:00",
        version: 2
      },
      timeout: 14000
    });

    const parsedResponse = lambdaUtils.parseLambdaResponse(response);
    expect(parsedResponse.entity).toEqual(
      expect.objectContaining({
        id: testEventId,
        duration: "02:00",
        status: statusType.ACTIVE,
        version: 2
      })
    );

    expect(parsedResponse.entity.venue.id).toEqual(testVenueId);
    expect(parsedResponse.entity.talents[0].id).toEqual(testTalentId);
    expect(parsedResponse.entity.eventSeries.id).toEqual(testEventSeriesId);

    // Allow time for the SNS search index update message to be processed.
    await delay(5000);
    expect(snsListener.receivedMessages).toEqual([
      {
        entityType: entityType.EVENT,
        entity: expect.objectContaining({
          id: testEventId,
          duration: "02:00",
          status: statusType.ACTIVE,
          version: 2
        })
      }
    ]);
  });

  it("should fail to get a non-existent event", async () => {
    expect(
      await sync(
        request({
          uri: "http://localhost:3014/public/event/does/not/exist",
          json: true,
          method: "GET",
          timeout: 14000,
          resolveWithFullResponse: true
        })
      )
    ).toThrow(/Entity Not Found/);
  });

  it("should update the event when the venue entity updates", async () => {
    snsListener.clearReceivedMessages();
    let response = await request({
      uri: "http://localhost:3014/admin/venue/" + testVenueId,
      json: true,
      method: "PUT",
      headers: { Authorization: cognitoAuth.EDITOR_AUTH_TOKEN },
      body: {
        ...testVenueBody,
        postcode: "N8 0KL",
        version: 2
      },
      timeout: 14000
    });

    // Allow time for the search index update message to be processed.
    await delay(5000);
    expect(snsListener.receivedMessages).toEqual(
      expect.arrayContaining([
        {
          entityType: entityType.EVENT,
          entity: expect.objectContaining({
            id: testEventId,
            duration: "02:00",
            status: statusType.ACTIVE,
            version: 2
          })
        },
        {
          entityType: entityType.VENUE,
          entity: expect.objectContaining({
            postcode: "N8 0KL",
            version: 2
          })
        }
      ])
    );

    // Check the event was updated:
    response = await request({
      uri: "http://localhost:3014/public/event/" + testEventId,
      json: true,
      method: "GET",
      timeout: 14000,
      resolveWithFullResponse: true
    });

    const parsedResponse = lambdaUtils.parseLambdaResponse(response.body);
    expect(parsedResponse.entity).toEqual(
      expect.objectContaining({
        id: testEventId,
        duration: "02:00",
        status: statusType.ACTIVE,
        version: 2,
        postcode: "N8 0KL"
      })
    );
  });

  it("should update the event when the event series entity updates", async () => {
    snsListener.clearReceivedMessages();
    await request({
      uri: "http://localhost:3014/admin/event-series/" + testEventSeriesId,
      json: true,
      method: "PUT",
      headers: { Authorization: cognitoAuth.EDITOR_AUTH_TOKEN },
      body: {
        ...testEventSeriesBody,
        summary: "Stand-up poetry New",
        version: 2
      },
      timeout: 14000
    });

    // Allow time for the search index update message to be processed.
    await delay(5000);
    expect(snsListener.receivedMessages).toEqual(
      expect.arrayContaining([
        {
          entityType: entityType.EVENT,
          entity: expect.objectContaining({
            id: testEventId,
            duration: "02:00",
            status: statusType.ACTIVE,
            version: 2
          })
        },
        {
          entityType: entityType.EVENT_SERIES,
          entity: expect.objectContaining({
            eventSeriesType: eventSeriesType.OCCASIONAL,
            summary: "Stand-up poetry New",
            status: statusType.ACTIVE,
            version: 2
          })
        }
      ])
    );
  });
});
