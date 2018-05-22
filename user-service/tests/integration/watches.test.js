"use strict";

const request = require("request-promise-native");
const uuidv4 = require("uuid/v4");
const testUtils = require("./utils");

describe("watches", () => {
  const userId = uuidv4();

  it("should update event watches", async () => {
    const response = await request({
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
          },
          {
            changeType: "add",
            id: "2222",
            label: "Label 2222",
            created: 2222
          }
        ]
      },
      timeout: 4000
    });

    expect(response).toEqual({ acknowledged: true });
  });

  it("should get the event watches", async () => {
    const response = await request({
      uri: "http://localhost:3020/user/watches/event",
      json: true,
      method: "GET",
      headers: { Authorization: testUtils.createAuthValue(userId) },
      timeout: 4000
    });

    expect(response).toEqual({
      entityType: "event",
      items: [
        { created: 1111, id: "1111", label: "Label 1111" },
        { created: 2222, id: "2222", label: "Label 2222" }
      ],
      version: 1
    });
  });

  it("should delete an event watch", async () => {
    let response = await request({
      uri: "http://localhost:3020/user/watches/event",
      json: true,
      method: "PUT",
      headers: { Authorization: testUtils.createAuthValue(userId) },
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
      timeout: 4000
    });

    expect(response).toEqual({ acknowledged: true });

    response = await request({
      uri: "http://localhost:3020/user/watches/event",
      json: true,
      method: "GET",
      headers: { Authorization: testUtils.createAuthValue(userId) },
      timeout: 4000
    });

    expect(response).toEqual({
      entityType: "event",
      items: [{ created: 2222, id: "2222", label: "Label 2222" }],
      version: 2
    });
  });
});
