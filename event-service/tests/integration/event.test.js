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
import {
  CREATE_EVENT_SERIES_MUTATION,
  UPDATE_EVENT_SERIES_MUTATION,
  EVENT_QUERY,
  EVENT_FOR_EDIT_QUERY,
  EVENT_FOR_EDIT_WITH_ALL_REFERENCES_QUERY,
  CREATE_EVENT_MUTATION,
  UPDATE_EVENT_MUTATION,
  CREATE_TALENT_MUTATION,
  CREATE_VENUE_MUTATION,
  UPDATE_VENUE_MUTATION
} from "./queries";
jest.setTimeout(30000);

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

    testVenueId = response.data.createVenue.node.id;

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

    testTalentId = response.data.createTalent.node.id;

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

    testEventSeriesId = response.data.createEventSeries.node.id;

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
          node: expect.objectContaining({
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

    testEventId = response.data.createEvent.node.id;

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
        event: {
          node: expect.objectContaining({
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
        eventForEdit: {
          node: expect.objectContaining({
            id: testEventId,
            summary: "An exhibition of paintings by Zaha Hadid",
            version: 1,
            venueId: testVenueId,
            eventSeriesId: testEventSeriesId,
            talents: [{ id: testTalentId }]
          })
        }
      }
    });
  });

  it("should get the event for edit with referenced entity details", async () => {
    const response = await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createReaderAuthToken() },
      body: {
        query: EVENT_FOR_EDIT_WITH_ALL_REFERENCES_QUERY,
        variables: { id: testEventId }
      },
      timeout: 14000
    });

    expect(response).toEqual({
      data: {
        eventForEdit: {
          node: expect.objectContaining({
            id: testEventId,
            summary: "An exhibition of paintings by Zaha Hadid",
            version: 1,
            venueId: testVenueId,
            venue: expect.objectContaining({
              id: testVenueId,
              name: testVenueBody.name
            }),
            eventSeriesId: testEventSeriesId,
            eventSeries: expect.objectContaining({
              id: testEventSeriesId,
              name: testEventSeriesBody.name
            }),
            talents: [
              {
                id: testTalentId,
                talent: expect.objectContaining({
                  id: testTalentId,
                  lastName: testTalentBody.lastName
                })
              }
            ]
          })
        }
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
          node: expect.objectContaining({
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
        event: { node: null }
      }
    });
  });

  it("should reindex the event when the venue entity updates", async () => {
    snsListener.clearReceivedMessages();
    await request({
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

    // Allow time for the search index update message to be processed.
    await delay(5000);
    expect(snsListener.receivedMessages).toEqual(
      expect.arrayContaining([
        {
          entityType: entityType.VENUE,
          entity: expect.objectContaining({
            postcode: "N8 0KL",
            version: 2
          })
        },
        {
          entityType: entityType.EVENT,
          entity: expect.objectContaining({
            id: testEventId,
            status: statusType.ACTIVE,
            version: 2
          })
        }
      ])
    );
  });

  it("should reindex the event when the event series entity updates", async () => {
    snsListener.clearReceivedMessages();
    await request({
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

    // Allow time for the search index update message to be processed.
    await delay(5000);
    expect(snsListener.receivedMessages).toEqual(
      expect.arrayContaining([
        {
          entityType: entityType.EVENT,
          entity: expect.objectContaining({
            id: testEventId,
            status: statusType.ACTIVE,
            version: 2
          })
        },
        {
          entityType: entityType.EVENT_SERIES,
          entity: expect.objectContaining({
            summary: "Stand-up poetry New",
            status: statusType.ACTIVE,
            version: 2
          })
        }
      ])
    );
  });
});
