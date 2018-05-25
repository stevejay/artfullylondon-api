"use strict";

const request = require("request-promise-native");
const uuidv4 = require("uuid/v4");
const testUtils = require("./utils");
jest.setTimeout(15000);

// TODO test wikipedia integration

const VALID_NEW_VENUE = {
  name: uuidv4(),
  version: 1,
  status: "Active",
  hearingFacilitiesType: "Unknown",
  links: [
    { type: "Wikipedia", url: "https://en.wikipedia.org/wiki/Almeida_Theatre" },
    { type: "Twitter", url: "https://twitter.com/AlmeidaTheatre" },
    { type: "Homepage", url: "https://www.almeida.co.uk/" },
    { type: "Facebook", url: "https://www.facebook.com/almeidatheatre/" },
    { type: "Access", url: "https://www.almeida.co.uk/access" }
  ],
  postcode: "N1 1TA",
  disabledBathroomType: "Present",
  address: "Almeida St\\nLondon",
  email: "boxoffice@almeida.co.uk",
  longitude: -0.103103,
  images: [
    { id: "eed89908d1aa41a69ec6acc5dc92bc99", ratio: 0.6656905807711079 }
  ],
  telephone: "020 7359 4404",
  description:
    "<p>The Almeida Theatre, opened in 1980, is a 325-seat studio theatre with an international reputation, which takes its name from the street on which it is located, off Upper Street, in the London Borough of Islington. The theatre produces a diverse range of drama. Successful plays often transfer to West End theatres.</p>",
  wheelchairAccessType: "Unknown",
  latitude: 51.539464,
  venueType: "Theatre",
  hasPermanentCollection: false
};

describe("venue", () => {
  let testVenueId = null;

  beforeAll(async () => {
    await testUtils.createElasticsearchIndex("venue-full");
    await testUtils.createElasticsearchIndex("venue-auto");
  });

  afterAll(async () => {
    await testUtils.deleteElasticsearchIndex("venue-full");
    await testUtils.deleteElasticsearchIndex("venue-auto");
  });

  it("should fail to create an invalid venue", async () => {
    expect(
      await testUtils.sync(
        request({
          uri: "http://localhost:3030/admin/venue",
          json: true,
          method: "POST",
          headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
          body: { status: "Active" },
          timeout: 14000
        })
      )
    ).toThrow(/Name can't be blank/);
  });

  it("should fail to create a venue when the user is the readonly user", async () => {
    expect(
      await testUtils.sync(
        request({
          uri: "http://localhost:3030/admin/venue",
          json: true,
          method: "POST",
          headers: { Authorization: testUtils.READONLY_AUTH_TOKEN },
          body: VALID_NEW_VENUE,
          timeout: 14000
        })
      )
    ).toThrow(/readonly user cannot modify system/);
  });

  it("should create a valid venue", async () => {
    const response = await request({
      uri: "http://localhost:3030/admin/venue",
      json: true,
      method: "POST",
      headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
      body: VALID_NEW_VENUE,
      timeout: 14000
    });

    expect(response.entity).toEqual(
      expect.objectContaining({
        status: "Active",
        postcode: "N1 1TA",
        version: 1
      })
    );

    testVenueId = response.entity.id;
  });

  it("should put the created venue in elasticsearch", async () => {
    let response = await testUtils.getDocument("venue-full", testVenueId);

    expect(response).toEqual(
      expect.objectContaining({
        _id: testVenueId,
        _index: "venue-full",
        _type: "doc",
        _version: 1,
        found: true
      })
    );

    response = await testUtils.getDocument("venue-auto", testVenueId);

    expect(response).toEqual(
      expect.objectContaining({
        _id: testVenueId,
        _index: "venue-auto",
        _type: "doc",
        _version: 1,
        found: true
      })
    );
  });

  it("should get the venue with cache control headers when using the public api", async () => {
    const response = await request({
      uri: "http://localhost:3030/public/venue/" + testVenueId,
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
        id: testVenueId,
        postcode: "N1 1TA",
        entityType: "venue",
        status: "Active",
        isFullEntity: true
      })
    );
  });

  it("should get the venue without cache control headers when using the admin api", async () => {
    const response = await request({
      uri: "http://localhost:3030/admin/venue/" + testVenueId,
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
        id: testVenueId,
        postcode: "N1 1TA",
        status: "Active",
        version: 1
      })
    );
  });

  it("should get the venue using the get multi endpoint", async () => {
    const response = await request({
      uri:
        "http://localhost:3030/public/venue?ids=" +
        encodeURIComponent(testVenueId),
      json: true,
      method: "GET",
      timeout: 14000
    });

    expect(response.entities.length).toEqual(1);

    expect(response.entities[0]).toEqual(
      expect.objectContaining({
        id: testVenueId,
        postcode: "N1 1TA",
        entityType: "venue",
        status: "Active"
      })
    );
  });

  it("should reject a stale update to the venue", async () => {
    expect(
      await testUtils.sync(
        request({
          uri: "http://localhost:3030/admin/venue/" + testVenueId,
          json: true,
          method: "PUT",
          headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
          body: VALID_NEW_VENUE,
          timeout: 14000
        })
      )
    ).toThrow(/Stale Data/);
  });

  it("should accept a valid update to the venue", async () => {
    const response = await request({
      uri: "http://localhost:3030/admin/venue/" + testVenueId,
      json: true,
      method: "PUT",
      headers: { Authorization: testUtils.EDITOR_AUTH_TOKEN },
      body: {
        ...VALID_NEW_VENUE,
        postcode: "N8 0KL",
        version: 2
      },
      timeout: 14000
    });

    expect(response.entity).toEqual(
      expect.objectContaining({
        id: testVenueId,
        postcode: "N8 0KL",
        status: "Active",
        version: 2
      })
    );
  });

  it("should put the updated venue in elasticsearch", async () => {
    let response = await testUtils.getDocument("venue-full", testVenueId);

    expect(response).toEqual(
      expect.objectContaining({
        _id: testVenueId,
        _index: "venue-full",
        _type: "doc",
        _version: 2,
        found: true
      })
    );

    response = await testUtils.getDocument("venue-auto", testVenueId);

    expect(response).toEqual(
      expect.objectContaining({
        _id: testVenueId,
        _index: "venue-auto",
        _type: "doc",
        _version: 2,
        found: true
      })
    );
  });

  it("should iterate through the venues", async () => {
    let response = await request({
      uri: "http://localhost:3030/admin/next-venue/",
      json: true,
      method: "GET",
      headers: { "x-api-key": testUtils.API_KEY }
    });

    expect(response.venueId).not.toEqual(null);

    await request({
      uri: "http://localhost:3030/admin/next-venue/" + testVenueId,
      json: true,
      method: "GET",
      headers: { "x-api-key": testUtils.API_KEY }
    });
  });

  it("should fail to get a non-existent venue", async () => {
    expect(
      await testUtils.sync(
        request({
          uri: "http://localhost:3030/public/venue/does-not-exist",
          json: true,
          method: "GET",
          timeout: 14000,
          resolveWithFullResponse: true
        })
      )
    ).toThrow(/Entity Not Found/);
  });
});
