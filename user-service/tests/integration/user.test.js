"use strict";

const request = require("request-promise-native");
const uuidv4 = require("uuid/v4");
const testUtils = require("./utils");

describe("user", () => {
  const userId = uuidv4();

  it("should get a user", async () => {
    let response = await request({
      uri: "http://localhost:3020/user/watches/event",
      json: true,
      method: "PUT",
      headers: { Authorization: testUtils.createAuthValue(userId) },
      body: {
        newVersion: 1,
        changes: [
          {
            changeType: "add",
            id: "1111",
            label: "Label 1111",
            created: 1111
          }
        ]
      },
      timeout: 4000
    });

    expect(response).toEqual({ acknowledged: true });

    response = await request({
      uri: "http://localhost:3020/user",
      json: true,
      method: "GET",
      headers: { Authorization: testUtils.createAuthValue(userId) },
      timeout: 4000
    });

    expect(response).toEqual({
      watches: [
        {
          entityType: "event",
          items: [{ created: 1111, id: "1111", label: "Label 1111" }],
          version: 1
        },
        { entityType: "tag", items: [], version: 0 },
        { entityType: "talent", items: [], version: 0 },
        { entityType: "venue", items: [], version: 0 },
        { entityType: "event-series", items: [], version: 0 }
      ]
    });
  });

  it("should delete a user", async () => {
    let response = await request({
      uri: "http://localhost:3020/user",
      json: true,
      method: "DELETE",
      headers: { Authorization: testUtils.createAuthValue(userId) },
      timeout: 4000
    });

    expect(response).toEqual({ acknowledged: true });

    response = await request({
      uri: "http://localhost:3020/user",
      json: true,
      method: "GET",
      headers: { Authorization: testUtils.createAuthValue(userId) },
      timeout: 4000
    });

    expect(response).toEqual({
      watches: [
        { entityType: "tag", items: [], version: 0 },
        { entityType: "talent", items: [], version: 0 },
        { entityType: "venue", items: [], version: 0 },
        { entityType: "event", items: [], version: 0 },
        { entityType: "event-series", items: [], version: 0 }
      ]
    });
  });
});
