"use strict";

const request = require("request-promise-native");
const uuidv4 = require("uuid/v4");
const delay = require("delay");
const testUtils = require("./utils");
jest.setTimeout(30000);

// TODO test wikipedia integration

const VALID_NEW_TALENT = {
  commonRole: "Poet",
  lastName: uuidv4(),
  links: [{ type: "Homepage", url: "http://www.byronvincent.com/" }],
  talentType: "Individual",
  version: 1,
  firstNames: "Byron",
  status: "Active"
};

describe("talent", () => {
  let testTalentId = null;

  beforeAll(async () => {
    await testUtils.createElasticsearchIndex("talent-full");
    await testUtils.createElasticsearchIndex("talent-auto");
    await testUtils.truncateAllTables();
  });

  afterAll(async () => {
    await testUtils.deleteElasticsearchIndex("talent-full");
    await testUtils.deleteElasticsearchIndex("talent-auto");
  });

  it("should fail to create an invalid talent", async () => {
    expect(
      await testUtils.sync(
        request({
          uri: "http://localhost:3030/admin/talent",
          json: true,
          method: "POST",
          headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
          body: { status: "Active" },
          timeout: 14000
        })
      )
    ).toThrow(/Last Name can't be blank/);
  });

  it("should fail to create a talent when the user is the readonly user", async () => {
    expect(
      await testUtils.sync(
        request({
          uri: "http://localhost:3030/admin/talent",
          json: true,
          method: "POST",
          headers: { Authorization: testUtils.READONLY_AUTH_TOKEN },
          body: VALID_NEW_TALENT,
          timeout: 14000
        })
      )
    ).toThrow(/readonly user cannot modify system/);
  });

  it("should create a valid talent", async () => {
    const response = await request({
      uri: "http://localhost:3030/admin/talent",
      json: true,
      method: "POST",
      headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
      body: VALID_NEW_TALENT,
      timeout: 14000
    });

    expect(response.entity).toEqual(
      expect.objectContaining({
        commonRole: "Poet",
        firstNames: "Byron",
        links: [{ type: "Homepage", url: "http://www.byronvincent.com/" }],
        status: "Active",
        talentType: "Individual",
        version: 1
      })
    );

    testTalentId = response.entity.id;
  });

  it("should put the created talent in elasticsearch", async () => {
    let response = await testUtils.getDocument("talent-full", testTalentId);

    expect(response).toEqual(
      expect.objectContaining({
        _id: testTalentId,
        _index: "talent-full",
        _type: "doc",
        _version: 1,
        found: true
      })
    );

    response = await testUtils.getDocument("talent-auto", testTalentId);

    expect(response).toEqual(
      expect.objectContaining({
        _id: testTalentId,
        _index: "talent-auto",
        _type: "doc",
        _version: 1,
        found: true
      })
    );
  });

  it("should get the talent with cache control headers when using the public api", async () => {
    const response = await request({
      uri: "http://localhost:3030/public/talent/" + testTalentId,
      json: true,
      method: "GET",
      timeout: 14000,
      resolveWithFullResponse: true
    });

    expect(response.headers).toEqual(
      expect.objectContaining({
        "x-artfully-cache": "Miss",
        "cache-control": "public, max-age=1800"
      })
    );

    expect(response.headers.etag).toBeDefined();

    expect(response.body.entity).toEqual(
      expect.objectContaining({
        id: testTalentId,
        commonRole: "Poet",
        firstNames: "Byron",
        status: "Active",
        talentType: "Individual",
        entityType: "talent",
        isFullEntity: true
      })
    );
  });

  it("should get the talent without cache control headers when using the admin api", async () => {
    const response = await request({
      uri: "http://localhost:3030/admin/talent/" + testTalentId,
      json: true,
      method: "GET",
      timeout: 14000,
      resolveWithFullResponse: true
    });

    expect(response.headers).toEqual(
      expect.objectContaining({
        "cache-control": "no-cache"
      })
    );

    expect(response.headers.etag).not.toBeDefined();

    expect(response.body.entity).toEqual(
      expect.objectContaining({
        id: testTalentId,
        firstNames: "Byron",
        status: "Active",
        version: 1
      })
    );
  });

  it("should get the talent using the get multi endpoint", async () => {
    const response = await request({
      uri:
        "http://localhost:3030/public/talent?ids=" +
        encodeURIComponent(testTalentId),
      json: true,
      method: "GET",
      timeout: 14000
    });

    expect(response.entities.length).toEqual(1);

    expect(response.entities[0]).toEqual(
      expect.objectContaining({
        id: testTalentId,
        commonRole: "Poet",
        firstNames: "Byron",
        status: "Active",
        talentType: "Individual",
        entityType: "talent"
      })
    );
  });

  it("should reject a stale update to the talent", async () => {
    expect(
      await testUtils.sync(
        request({
          uri: "http://localhost:3030/admin/talent/" + testTalentId,
          json: true,
          method: "PUT",
          headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
          body: VALID_NEW_TALENT,
          timeout: 14000
        })
      )
    ).toThrow(/Stale Data/);
  });

  it("should accept a valid update to the talent", async () => {
    const response = await request({
      uri: "http://localhost:3030/admin/talent/" + testTalentId,
      json: true,
      method: "PUT",
      headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
      body: {
        ...VALID_NEW_TALENT,
        firstNames: "Byron New",
        version: 2
      },
      timeout: 14000
    });

    expect(response.entity).toEqual(
      expect.objectContaining({
        id: testTalentId,
        firstNames: "Byron New",
        status: "Active",
        version: 2
      })
    );
  });

  it("should put the updated talent in elasticsearch", async () => {
    let response = await testUtils.getDocument("talent-full", testTalentId);

    expect(response).toEqual(
      expect.objectContaining({
        _id: testTalentId,
        _index: "talent-full",
        _type: "doc",
        _version: 2,
        found: true
      })
    );

    response = await testUtils.getDocument("talent-auto", testTalentId);

    expect(response).toEqual(
      expect.objectContaining({
        _id: testTalentId,
        _index: "talent-auto",
        _type: "doc",
        _version: 2,
        found: true
      })
    );
  });

  it("should fail to get a non-existent talent", async () => {
    expect(
      await testUtils.sync(
        request({
          uri: "http://localhost:3030/public/talent/does-not-exist",
          json: true,
          method: "GET",
          timeout: 14000,
          resolveWithFullResponse: true
        })
      )
    ).toThrow(/Entity Not Found/);
  });

  it("should refresh the talent-full search index", async () => {
    await testUtils.createElasticsearchIndex("talent-full");

    let response = await request({
      uri: "http://localhost:3030/admin/search/talent-full/latest/refresh",
      json: true,
      method: "POST",
      headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
      timeout: 14000
    });

    expect(response).toEqual({ acknowledged: true });

    await delay(5000);

    response = await testUtils.getDocument("talent-full", testTalentId);

    expect(response).toEqual(
      expect.objectContaining({
        _id: testTalentId,
        _index: "talent-full",
        _type: "doc",
        _version: 2,
        found: true
      })
    );
  });

  it("should refresh the talent-auto search index", async () => {
    await testUtils.createElasticsearchIndex("talent-auto");

    let response = await request({
      uri: "http://localhost:3030/admin/search/talent-auto/latest/refresh",
      json: true,
      method: "POST",
      headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
      timeout: 14000
    });

    expect(response).toEqual({ acknowledged: true });

    await delay(5000);

    response = await testUtils.getDocument("talent-auto", testTalentId);

    expect(response).toEqual(
      expect.objectContaining({
        _id: testTalentId,
        _index: "talent-auto",
        _type: "doc",
        _version: 2,
        found: true
      })
    );
  });
});
