import request from "request-promise-native";
import delay from "delay";
import * as testData from "../utils/test-data";
import * as dynamodb from "../utils/dynamodb";
import SnsListener from "../utils/serverless-offline-sns-listener";
import * as costType from "../../src/types/cost-type";
import * as entityType from "../../src/types/entity-type";
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
      venue {
        id
      }
      eventSeries {
        id
      }
      talents {
        talent {
          id
        }
      }
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
      venueId
      eventSeriesId
      talents {
        id
      }
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
        venue {
          id
        }
        eventSeries {
          id
        }
        talents {
          talent {
            id
          }
        }
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
        venue {
          id
        }
        eventSeries {
          id
        }
        talents {
          talent {
            id
          }
        }
      }
    }
  }
`;

const CREATE_TALENT_MUTATION = `
  mutation CreateTalent(
    $status: StatusTypeEnum!
    $links: [LinkInput!]
    $images: [ImageInput!]
    $weSay: String
    $notes: String
    $description: String
    $descriptionCredit: String
    $firstNames: String
    $lastName: String!
    $talentType: TalentTypeEnum!
    $commonRole: String!
  ) {
    createTalent(input: {
      status: $status
      links: $links
      images: $images
      weSay: $weSay
      notes: $notes
      description: $description
      descriptionCredit: $descriptionCredit
      firstNames: $firstNames
      lastName: $lastName
      talentType: $talentType
      commonRole: $commonRole
    }) {
      talent {
        id
        firstNames
        lastName
        commonRole
      }
    }
  }
`;

const CREATE_VENUE_MUTATION = `
  mutation CreateVenue(
    $status: StatusTypeEnum!
    $links: [LinkInput!]
    $images: [ImageInput!]
    $weSay: String
    $notes: String
    $description: String
    $descriptionCredit: String
    $name: String!
    $venueType: VenueTypeEnum!
    $address: String!
    $postcode: String!
    $latitude: Float!
    $longitude: Float!
    $email: String
    $telephone: String
    $wheelchairAccessType: WheelchairAccessTypeEnum!
    $disabledBathroomType: DisabledBathroomTypeEnum!
    $hearingFacilitiesType: HearingFacilitiesTypeEnum!
    $hasPermanentCollection: Boolean!
    $openingTimes: [DayOpeningTimeInput!]
    $additionalOpeningTimes: [DateOpeningTimeInput!]
    $openingTimesClosures: [DateClosedTimeRangeInput!]
    $namedClosures: [NamedClosureTypeEnum!]
  ) {
    createVenue(input: {
      status: $status
      links: $links
      images: $images
      weSay: $weSay
      notes: $notes
      description: $description
      descriptionCredit: $descriptionCredit
      name: $name
      venueType: $venueType
      address: $address
      postcode: $postcode
      latitude: $latitude
      longitude: $longitude
      email: $email
      telephone: $telephone
      wheelchairAccessType: $wheelchairAccessType
      disabledBathroomType: $disabledBathroomType
      hearingFacilitiesType: $hearingFacilitiesType
      hasPermanentCollection: $hasPermanentCollection
      openingTimes: $openingTimes
      additionalOpeningTimes: $additionalOpeningTimes
      openingTimesClosures: $openingTimesClosures
      namedClosures: $namedClosures
    }) {
      venue {
        id
        name
        venueType
        postcode
      }
    }
  }
`;

const CREATE_EVENT_SERIES_MUTATION = `
  mutation CreateEventSeries(
    $status: StatusTypeEnum!
    $links: [LinkInput!]
    $images: [ImageInput!]
    $weSay: String
    $notes: String
    $description: String
    $descriptionCredit: String
    $name: String!
    $eventSeriesType: EventSeriesTypeEnum!
    $occurrence: String!
    $summary: String!
  ) {
    createEventSeries(input: {
      status: $status
      links: $links
      images: $images
      weSay: $weSay
      notes: $notes
      description: $description
      descriptionCredit: $descriptionCredit
      name: $name
      eventSeriesType: $eventSeriesType
      occurrence: $occurrence
      summary: $summary
    }) {
      eventSeries {
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
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createEditorAuthToken() },
      body: {
        query: CREATE_VENUE_MUTATION,
        variables: testVenueBody
      },
      timeout: 14000
    });

    testVenueId = response.data.createVenue.venue.id;

    response = await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createEditorAuthToken() },
      body: {
        query: CREATE_TALENT_MUTATION,
        variables: testTalentBody
      },
      timeout: 14000
    });

    testTalentId = response.data.createTalent.talent.id;

    response = await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createEditorAuthToken() },
      body: {
        query: CREATE_EVENT_SERIES_MUTATION,
        variables: testEventSeriesBody
      },
      timeout: 14000
    });

    testEventSeriesId = response.data.createEventSeries.eventSeries.id;

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

  it("should fail to create an event when the user is the readonly user", async () => {
    const response = await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createReaderAuthToken() },
      body: {
        query: CREATE_EVENT_MUTATION,
        variables: testEventBody
      },
      timeout: 14000
    });

    expect(response).toEqual({
      data: {
        createEvent: null
      },
      errors: [
        expect.objectContaining({
          message: expect.stringContaining(
            "User not authorized for requested action"
          )
        })
      ]
    });
  });

  it("should create a valid event", async () => {
    snsListener.clearReceivedMessages();
    const response = await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createEditorAuthToken() },
      body: {
        query: CREATE_EVENT_MUTATION,
        variables: testEventBody
      },
      timeout: 14000
    });

    expect(response).toEqual({
      data: {
        createEvent: {
          event: expect.objectContaining({
            summary: "An exhibition of paintings by Zaha Hadid",
            venue: {
              id: testVenueId
            },
            eventSeries: {
              id: testEventSeriesId
            },
            talents: [{ talent: { id: testTalentId } }]
          })
        }
      }
    });

    testEventId = response.data.createEvent.event.id;

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
          summary: "An exhibition of paintings by Zaha Hadid",
          version: 1
        })
      }
    ]);
  });

  it("should get the event", async () => {
    const response = await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createReaderAuthToken() },
      body: {
        query: EVENT_QUERY,
        variables: { id: testEventId }
      },
      timeout: 14000
    });

    expect(response).toEqual({
      data: {
        event: expect.objectContaining({
          id: testEventId,
          summary: "An exhibition of paintings by Zaha Hadid",
          venue: {
            id: testVenueId
          },
          eventSeries: {
            id: testEventSeriesId
          },
          talents: [{ talent: { id: testTalentId } }]
        })
      }
    });
  });

  it("should get the event for edit", async () => {
    const response = await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createReaderAuthToken() },
      body: {
        query: EVENT_FOR_EDIT_QUERY,
        variables: { id: testEventId }
      },
      timeout: 14000
    });

    expect(response).toEqual({
      data: {
        eventForEdit: expect.objectContaining({
          id: testEventId,
          summary: "An exhibition of paintings by Zaha Hadid",
          version: 1,
          venueId: testVenueId,
          eventSeriesId: testEventSeriesId,
          talents: [{ id: testTalentId }]
        })
      }
    });
  });

  it("should reject a stale update to the event", async () => {
    const response = await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createEditorAuthToken() },
      body: {
        query: UPDATE_EVENT_MUTATION,
        variables: {
          ...testEventBody,
          version: 1,
          id: testEventId
        }
      },
      timeout: 14000
    });

    expect(response).toEqual({
      data: {
        updateEvent: null
      },
      errors: [
        expect.objectContaining({
          message: expect.stringContaining("Stale Data")
        })
      ]
    });
  });

  it("should accept a valid update to the event", async () => {
    snsListener.clearReceivedMessages();
    const response = await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createEditorAuthToken() },
      body: {
        query: UPDATE_EVENT_MUTATION,
        variables: {
          ...testEventBody,
          summary: "New summary",
          version: 2,
          id: testEventId
        }
      },
      timeout: 14000
    });

    expect(response).toEqual({
      data: {
        updateEvent: {
          event: expect.objectContaining({
            id: testEventId,
            summary: "New summary"
          })
        }
      }
    });

    // Allow time for the SNS search index update message to be processed.
    await delay(5000);
    expect(snsListener.receivedMessages).toEqual([
      {
        entityType: entityType.EVENT,
        entity: expect.objectContaining({
          id: testEventId,
          summary: "New summary",
          version: 2
        })
      }
    ]);
  });

  it("should fail to get a non-existent event", async () => {
    const response = await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createReaderAuthToken() },
      body: {
        query: EVENT_QUERY,
        variables: { id: "event/foo/2018/does-not-exist" }
      },
      timeout: 14000
    });

    expect(response).toEqual({
      data: {
        event: null
      },
      errors: [
        expect.objectContaining({
          message: expect.stringContaining("Not Found")
        })
      ]
    });
  });

  // it("should update the event when the venue entity updates", async () => {
  //   snsListener.clearReceivedMessages();
  //   let response = await request({
  //     uri: "http://localhost:3014/admin/venue/" + testVenueId,
  //     json: true,
  //     method: "PUT",
  //     headers: { Authorization: cognitoAuth.EDITOR_AUTH_TOKEN },
  //     body: {
  //       ...testVenueBody,
  //       postcode: "N8 0KL",
  //       version: 2
  //     },
  //     timeout: 14000
  //   });

  //   // Allow time for the search index update message to be processed.
  //   await delay(5000);
  //   expect(snsListener.receivedMessages).toEqual(
  //     expect.arrayContaining([
  //       {
  //         entityType: entityType.EVENT,
  //         entity: expect.objectContaining({
  //           id: testEventId,
  //           duration: "02:00",
  //           status: statusType.ACTIVE,
  //           version: 2
  //         })
  //       },
  //       {
  //         entityType: entityType.VENUE,
  //         entity: expect.objectContaining({
  //           postcode: "N8 0KL",
  //           version: 2
  //         })
  //       }
  //     ])
  //   );

  //   // Check the event was updated:
  //   response = await request({
  //     uri: "http://localhost:3014/public/event/" + testEventId,
  //     json: true,
  //     method: "GET",
  //     timeout: 14000,
  //     resolveWithFullResponse: true
  //   });

  //   const parsedResponse = lambdaUtils.parseLambdaResponse(response.body);
  //   expect(parsedResponse.entity).toEqual(
  //     expect.objectContaining({
  //       id: testEventId,
  //       duration: "02:00",
  //       status: statusType.ACTIVE,
  //       version: 2,
  //       postcode: "N8 0KL"
  //     })
  //   );
  // });

  // it("should update the event when the event series entity updates", async () => {
  //   snsListener.clearReceivedMessages();
  //   await request({
  //     uri: "http://localhost:3014/admin/event-series/" + testEventSeriesId,
  //     json: true,
  //     method: "PUT",
  //     headers: { Authorization: cognitoAuth.EDITOR_AUTH_TOKEN },
  //     body: {
  //       ...testEventSeriesBody,
  //       summary: "Stand-up poetry New",
  //       version: 2
  //     },
  //     timeout: 14000
  //   });

  //   // Allow time for the search index update message to be processed.
  //   await delay(5000);
  //   expect(snsListener.receivedMessages).toEqual(
  //     expect.arrayContaining([
  //       {
  //         entityType: entityType.EVENT,
  //         entity: expect.objectContaining({
  //           id: testEventId,
  //           duration: "02:00",
  //           status: statusType.ACTIVE,
  //           version: 2
  //         })
  //       },
  //       {
  //         entityType: entityType.EVENT_SERIES,
  //         entity: expect.objectContaining({
  //           eventSeriesType: eventSeriesType.OCCASIONAL,
  //           summary: "Stand-up poetry New",
  //           status: statusType.ACTIVE,
  //           version: 2
  //         })
  //       }
  //     ])
  //   );
  // });
});
