import request from "request-promise-native";
import delay from "delay";
import * as testData from "../utils/test-data";
import * as dynamodb from "../utils/dynamodb";
import SnsListener from "../utils/serverless-offline-sns-listener";
import * as entityType from "../../src/types/entity-type";
import MockJwksServer from "../utils/mock-jwks-server";
import * as authUtils from "../utils/authentication";
jest.setTimeout(30000);

const EVENT_SERIES_QUERY = `
  query GetEventSeries($id: ID!) {
    eventSeries(id: $id) {
      id
      name
      summary
    }
  }
`;

const EVENT_SERIES_FOR_EDIT_QUERY = `
  query GetEventSeriesForEdit($id: ID!) {
    eventSeriesForEdit(id: $id) {
      id
      name
      summary
      version
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

const UPDATE_EVENT_SERIES_MUTATION = `
  mutation UpdateEventSeries(
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
    $eventSeriesType: EventSeriesTypeEnum!
    $occurrence: String!
    $summary: String!
  ) {
    updateEventSeries(input: {
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

describe("event series", () => {
  const mockJwksServer = new MockJwksServer();
  let testEventSeriesId = null;
  let snsListener = null;
  const testEventSeriesBody = testData.createNewEventSeriesBody();

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

  it("should fail to create an event series when the user is the readonly user", async () => {
    const response = await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createReaderAuthToken() },
      body: {
        query: CREATE_EVENT_SERIES_MUTATION,
        variables: testEventSeriesBody
      },
      timeout: 14000
    });

    expect(response).toEqual({
      data: {
        createEventSeries: null
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

  it("should create a valid event series", async () => {
    snsListener.clearReceivedMessages();
    const response = await request({
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

    expect(response).toEqual({
      data: {
        createEventSeries: {
          eventSeries: expect.objectContaining({
            summary: "Stand-up poetry"
          })
        }
      }
    });

    testEventSeriesId = response.data.createEventSeries.eventSeries.id;

    await delay(3000);
    expect(snsListener.receivedMessages).toEqual([
      {
        entityType: entityType.EVENT_SERIES,
        entity: expect.objectContaining({
          id: testEventSeriesId,
          summary: "Stand-up poetry",
          version: 1
        })
      }
    ]);
  });

  it("should get the event series", async () => {
    const response = await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createReaderAuthToken() },
      body: {
        query: EVENT_SERIES_QUERY,
        variables: { id: testEventSeriesId }
      },
      timeout: 14000
    });

    expect(response).toEqual({
      data: {
        eventSeries: expect.objectContaining({
          id: testEventSeriesId,
          summary: "Stand-up poetry"
        })
      }
    });
  });

  it("should get the event series for edit", async () => {
    const response = await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createReaderAuthToken() },
      body: {
        query: EVENT_SERIES_FOR_EDIT_QUERY,
        variables: { id: testEventSeriesId }
      },
      timeout: 14000
    });

    expect(response).toEqual({
      data: {
        eventSeriesForEdit: expect.objectContaining({
          id: testEventSeriesId,
          summary: "Stand-up poetry",
          version: 1
        })
      }
    });
  });

  it("should reject a stale update to the event series", async () => {
    const response = await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createEditorAuthToken() },
      body: {
        query: UPDATE_EVENT_SERIES_MUTATION,
        variables: {
          ...testEventSeriesBody,
          version: 1,
          id: testEventSeriesId
        }
      },
      timeout: 14000
    });

    expect(response).toEqual({
      data: {
        updateEventSeries: null
      },
      errors: [
        expect.objectContaining({
          message: expect.stringContaining("Stale Data")
        })
      ]
    });
  });

  it("should accept a valid update to the event series", async () => {
    snsListener.clearReceivedMessages();
    const response = await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createEditorAuthToken() },
      body: {
        query: UPDATE_EVENT_SERIES_MUTATION,
        variables: {
          ...testEventSeriesBody,
          summary: "Stand-up poetry New",
          version: 2,
          id: testEventSeriesId
        }
      },
      timeout: 14000
    });

    expect(response).toEqual({
      data: {
        updateEventSeries: {
          eventSeries: expect.objectContaining({
            id: testEventSeriesId,
            summary: "Stand-up poetry New"
          })
        }
      }
    });

    await delay(3000);
    expect(snsListener.receivedMessages).toEqual([
      {
        entityType: entityType.EVENT_SERIES,
        entity: expect.objectContaining({
          id: testEventSeriesId,
          summary: "Stand-up poetry New",
          version: 2
        })
      }
    ]);
  });

  it("should fail to get a non-existent event series", async () => {
    const response = await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createReaderAuthToken() },
      body: {
        query: EVENT_SERIES_QUERY,
        variables: { id: "event-series/does-not-exist" }
      },
      timeout: 14000
    });

    expect(response).toEqual({
      data: {
        eventSeries: null
      },
      errors: [
        expect.objectContaining({
          message: expect.stringContaining("Not Found")
        })
      ]
    });
  });
});
