import request from "request-promise-native";
import delay from "delay";
import * as testData from "../utils/test-data";
import * as dynamodb from "../utils/dynamodb";
import SnsListener from "../utils/serverless-offline-sns-listener";
import * as entityType from "../../src/types/entity-type";
import * as venueType from "../../src/types/venue-type";
import MockJwksServer from "../utils/mock-jwks-server";
import * as authUtils from "../utils/authentication";
jest.setTimeout(30000);

const VENUE_QUERY = `
  query GetVenue($id: ID!) {
    venue(id: $id) {
      id
      name
      venueType
      postcode
    }
  }
`;

const VENUE_FOR_EDIT_QUERY = `
  query GetVenueForEdit($id: ID!) {
    venueForEdit(id: $id) {
      id
      name
      venueType
      postcode
      version
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

const UPDATE_VENUE_MUTATION = `
  mutation UpdateVenue(
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
    updateVenue(input: {
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

describe("venue", () => {
  const mockJwksServer = new MockJwksServer();
  let testVenueId = null;
  let snsListener = null;
  const testVenueBody = testData.createNewVenueBody();

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
  });

  afterAll(async () => {
    mockJwksServer.stop();
    await snsListener.stopListening();
  });

  it("should fail to create a venue when the user is the readonly user", async () => {
    const response = await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createReaderAuthToken() },
      body: {
        query: CREATE_VENUE_MUTATION,
        variables: testVenueBody
      },
      timeout: 14000
    });

    expect(response).toEqual({
      data: {
        createVenue: null
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

  it("should create a valid venue", async () => {
    snsListener.clearReceivedMessages();
    const response = await request({
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

    expect(response).toEqual({
      data: {
        createVenue: {
          venue: expect.objectContaining({
            postcode: "N1 1TA",
            venueType: venueType.THEATRE
          })
        }
      }
    });

    testVenueId = response.data.createVenue.venue.id;

    await delay(3000);
    expect(snsListener.receivedMessages).toEqual([
      {
        entityType: entityType.VENUE,
        entity: expect.objectContaining({
          postcode: "N1 1TA",
          venueType: venueType.THEATRE,
          version: 1
        })
      }
    ]);
  });

  it("should get the venue", async () => {
    const response = await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createReaderAuthToken() },
      body: {
        query: VENUE_QUERY,
        variables: { id: testVenueId }
      },
      timeout: 14000
    });

    expect(response).toEqual({
      data: {
        venue: expect.objectContaining({
          id: testVenueId,
          postcode: "N1 1TA",
          venueType: venueType.THEATRE
        })
      }
    });
  });

  it("should get the venue for edit", async () => {
    const response = await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createReaderAuthToken() },
      body: {
        query: VENUE_FOR_EDIT_QUERY,
        variables: { id: testVenueId }
      },
      timeout: 14000
    });

    expect(response).toEqual({
      data: {
        venueForEdit: expect.objectContaining({
          id: testVenueId,
          postcode: "N1 1TA",
          venueType: venueType.THEATRE,
          version: 1
        })
      }
    });
  });

  it("should reject a stale update to the venue", async () => {
    const response = await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createEditorAuthToken() },
      body: {
        query: UPDATE_VENUE_MUTATION,
        variables: {
          ...testVenueBody,
          version: 1,
          id: testVenueId
        }
      },
      timeout: 14000
    });

    expect(response).toEqual({
      data: {
        updateVenue: null
      },
      errors: [
        expect.objectContaining({
          message: expect.stringContaining("Stale Data")
        })
      ]
    });
  });

  it("should accept a valid update to the venue", async () => {
    snsListener.clearReceivedMessages();
    const response = await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createEditorAuthToken() },
      body: {
        query: UPDATE_VENUE_MUTATION,
        variables: {
          ...testVenueBody,
          postcode: "N8 0KL",
          version: 2,
          id: testVenueId
        }
      },
      timeout: 14000
    });

    expect(response).toEqual({
      data: {
        updateVenue: {
          venue: expect.objectContaining({
            id: testVenueId,
            postcode: "N8 0KL",
            venueType: venueType.THEATRE
          })
        }
      }
    });

    await delay(3000);
    expect(snsListener.receivedMessages).toEqual([
      {
        entityType: entityType.VENUE,
        entity: expect.objectContaining({
          id: testVenueId,
          postcode: "N8 0KL",
          venueType: venueType.THEATRE,
          version: 2
        })
      }
    ]);
  });

  it("should fail to get a non-existent venue", async () => {
    const response = await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createReaderAuthToken() },
      body: {
        query: VENUE_QUERY,
        variables: { id: "venue/does-not-exist" }
      },
      timeout: 14000
    });

    expect(response).toEqual({
      data: {
        venue: null
      },
      errors: [
        expect.objectContaining({
          message: expect.stringContaining("Not Found")
        })
      ]
    });
  });
});
