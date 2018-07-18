import request from "request-promise-native";
import delay from "delay";
import * as testData from "../utils/test-data";
import * as dynamodb from "../utils/dynamodb";
import SnsListener from "../utils/serverless-offline-sns-listener";
import * as entityType from "../../src/types/entity-type";
import MockJwksServer from "../utils/mock-jwks-server";
import * as authUtils from "../utils/authentication";
import {
  TALENT_QUERY,
  TALENT_FOR_EDIT_QUERY,
  CREATE_TALENT_MUTATION,
  UPDATE_TALENT_MUTATION
} from "./queries";
jest.setTimeout(30000);

describe("talent", () => {
  const mockJwksServer = new MockJwksServer();
  let testTalentId = null;
  let snsListener = null;
  const testTalentBody = testData.createNewTalentBody();

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

  it("should fail to create a talent when the user is the readonly user", async () => {
    const response = await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createReaderAuthToken() },
      body: {
        query: CREATE_TALENT_MUTATION,
        variables: testTalentBody
      },
      timeout: 14000
    });

    expect(response).toEqual({
      data: {
        createTalent: null
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

  it("should create a valid talent", async () => {
    snsListener.clearReceivedMessages();
    const response = await request({
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

    expect(response).toEqual({
      data: {
        createTalent: {
          node: expect.objectContaining({
            firstNames: "Byron",
            commonRole: "Poet"
          })
        }
      }
    });

    testTalentId = response.data.createTalent.node.id;

    await delay(3000);
    expect(snsListener.receivedMessages).toEqual([
      {
        entityType: entityType.TALENT,
        entity: expect.objectContaining({
          firstNames: "Byron",
          commonRole: "Poet",
          version: 1
        })
      }
    ]);
  });

  it("should get the talent", async () => {
    const response = await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createReaderAuthToken() },
      body: {
        query: TALENT_QUERY,
        variables: { id: testTalentId }
      },
      timeout: 14000
    });

    expect(response).toEqual({
      data: {
        talent: {
          node: expect.objectContaining({
            id: testTalentId,
            firstNames: "Byron",
            commonRole: "Poet"
          })
        }
      }
    });
  });

  it("should get the talent for edit", async () => {
    const response = await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createReaderAuthToken() },
      body: {
        query: TALENT_FOR_EDIT_QUERY,
        variables: { id: testTalentId }
      },
      timeout: 14000
    });

    expect(response).toEqual({
      data: {
        talentForEdit: {
          node: expect.objectContaining({
            id: testTalentId,
            firstNames: "Byron",
            commonRole: "Poet",
            version: 1
          })
        }
      }
    });
  });

  it("should reject a stale update to the talent", async () => {
    const response = await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createEditorAuthToken() },
      body: {
        query: UPDATE_TALENT_MUTATION,
        variables: {
          ...testTalentBody,
          version: 1,
          id: testTalentId
        }
      },
      timeout: 14000
    });

    expect(response).toEqual({
      data: {
        updateTalent: null
      },
      errors: [
        expect.objectContaining({
          message: expect.stringContaining("Stale Data")
        })
      ]
    });
  });

  it("should accept a valid update to the talent", async () => {
    snsListener.clearReceivedMessages();
    const response = await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createEditorAuthToken() },
      body: {
        query: UPDATE_TALENT_MUTATION,
        variables: {
          ...testTalentBody,
          firstNames: "Byron New",
          version: 2,
          id: testTalentId
        }
      },
      timeout: 14000
    });

    expect(response).toEqual({
      data: {
        updateTalent: {
          node: expect.objectContaining({
            firstNames: "Byron New",
            commonRole: "Poet"
          })
        }
      }
    });

    await delay(3000);
    expect(snsListener.receivedMessages).toEqual([
      {
        entityType: entityType.TALENT,
        entity: expect.objectContaining({
          firstNames: "Byron New",
          commonRole: "Poet",
          version: 2
        })
      }
    ]);
  });

  it("should fail to get a non-existent talent", async () => {
    const response = await request({
      uri: "http://localhost:3014/graphql",
      json: true,
      method: "POST",
      headers: { Authorization: authUtils.createReaderAuthToken() },
      body: {
        query: TALENT_QUERY,
        variables: { id: "talent/does-not-exist" }
      },
      timeout: 14000
    });

    expect(response).toEqual({
      data: {
        talent: { node: null }
      }
    });
  });
});
