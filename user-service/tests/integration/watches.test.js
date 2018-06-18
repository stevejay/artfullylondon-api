import request from "request-promise-native";
import uuidv4 from "uuid/v4";
import * as authUtils from "../utils/auth";
jest.setTimeout(60000);

describe("watches", () => {
  const userId = uuidv4();

  it("should update event watches", async () => {
    const response = await request({
      uri: "http://localhost:3012/user/watches/event",
      json: true,
      method: "PUT",
      headers: {
        Authorization: authUtils.createAuthorizationHeaderValue(userId)
      },
      body: {
        newVersion: 1,
        changes: [
          {
            changeType: "add",
            id: "1111",
            label: "Label 1111",
            created: 1111
          },
          {
            changeType: "add",
            id: "2222",
            label: "Label 2222",
            created: 2222
          }
        ]
      },
      timeout: 30000
    });

    expect(response).toEqual(
      expect.stringContaining(JSON.stringify({ acknowledged: true }))
    );
  });

  it("should get the event watches", async () => {
    const response = await request({
      uri: "http://localhost:3012/user/watches/event",
      json: true,
      method: "GET",
      headers: {
        Authorization: authUtils.createAuthorizationHeaderValue(userId)
      },
      timeout: 30000
    });

    expect(response).toEqual(
      expect.stringContaining(
        JSON.stringify({
          items: [
            { created: 1111, id: "1111", label: "Label 1111" },
            { created: 2222, id: "2222", label: "Label 2222" }
          ],
          version: 1,
          entityType: "event"
        })
      )
    );
  });

  it("should delete an event watch", async () => {
    let response = await request({
      uri: "http://localhost:3012/user/watches/event",
      json: true,
      method: "PUT",
      headers: {
        Authorization: authUtils.createAuthorizationHeaderValue(userId)
      },
      body: {
        newVersion: 2,
        changes: [
          {
            changeType: "delete",
            id: "1111",
            label: "Label 1111",
            created: 1111
          }
        ]
      },
      timeout: 30000
    });

    expect(response).toEqual(
      expect.stringContaining(JSON.stringify({ acknowledged: true }))
    );

    response = await request({
      uri: "http://localhost:3012/user/watches/event",
      json: true,
      method: "GET",
      headers: {
        Authorization: authUtils.createAuthorizationHeaderValue(userId)
      },
      timeout: 30000
    });

    expect(response).toEqual(
      expect.stringContaining(
        JSON.stringify({
          items: [{ created: 2222, id: "2222", label: "Label 2222" }],
          version: 2,
          entityType: "event"
        })
      )
    );
  });
});
