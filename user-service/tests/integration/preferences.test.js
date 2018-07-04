import request from "request-promise-native";
import uuidv4 from "uuid/v4";
import { sync } from "jest-toolkit";
import * as authUtils from "../utils/auth";
import * as emailFrequencyType from "../../src/email-frequency-type";
jest.setTimeout(60000);

const PREFERENCES_QUERY = `
{
  preferences {
    emailFrequency
  }
}
`;

const UPDATE_PREFERENCES_MUTATION = `
mutation UpdatePreferences($emailFrequency: EmailFrequencyEnum!) {
  updatePreferences(input: { emailFrequency: $emailFrequency }) {
    ok
  }
}
`;

describe("preferences", () => {
  const userId = uuidv4();

  it("should read default preferences", async () => {
    const response = await request({
      uri: "http://localhost:3012/graphql",
      json: true,
      method: "POST",
      headers: {
        Authorization: authUtils.createAuthorizationHeaderValue(userId)
      },
      body: { query: PREFERENCES_QUERY },
      timeout: 30000
    });

    expect(response).toEqual({
      data: {
        preferences: {
          emailFrequency: emailFrequencyType.DAILY
        }
      }
    });
  });

  it("should update preferences", async () => {
    const response = await request({
      uri: "http://localhost:3012/graphql",
      json: true,
      method: "POST",
      headers: {
        Authorization: authUtils.createAuthorizationHeaderValue(userId)
      },
      body: {
        query: UPDATE_PREFERENCES_MUTATION,
        variables: {
          emailFrequency: emailFrequencyType.WEEKLY
        }
      },
      timeout: 30000
    });

    expect(response).toEqual({
      data: {
        updatePreferences: {
          ok: true
        }
      }
    });
  });

  it("should read the updated preferences", async () => {
    const response = await request({
      uri: "http://localhost:3012/graphql",
      json: true,
      method: "POST",
      headers: {
        Authorization: authUtils.createAuthorizationHeaderValue(userId)
      },
      body: { query: PREFERENCES_QUERY },
      timeout: 30000
    });

    expect(response).toEqual({
      data: {
        preferences: {
          emailFrequency: emailFrequencyType.WEEKLY
        }
      }
    });
  });
});
