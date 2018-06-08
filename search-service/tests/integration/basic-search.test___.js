import request from "request-promise-native";
import * as elasticsearch from "../utils/elasticsearch";
jest.setTimeout(60000);

describe("basic search", () => {
  beforeAll(async () => {
    await elasticsearch.createTemplate("venue-search");
    await elasticsearch.createTemplate("talent-search");
    await elasticsearch.createTemplate("event-search");
    await elasticsearch.createTemplate("event-series-search");

    await elasticsearch.createIndex("talent-full");
    await elasticsearch.createIndex("venue-full");
    await elasticsearch.createIndex("event-full");
    await elasticsearch.createIndex("event-series-full");

    await elasticsearch.indexDocument("talent-full", {
      status: "Active",
      id: 1,
      commonRole: "Director",
      entityType: "talent",
      firstNames: "Carrie",
      lastName: "Cracknell",
      lastName_sort: "cracknell"
    });
    await elasticsearch.indexDocument("talent-full", {
      status: "Active",
      id: 2,
      commonRole: "Actor",
      entityType: "talent",
      firstNames: "Dave",
      lastName: "Donnelly",
      lastName_sort: "donnelly"
    });

    await elasticsearch.indexDocument("venue-full", {
      status: "Active",
      id: 1,
      entityType: "venue",
      name: "Almeida Theatre"
    });
    await elasticsearch.indexDocument("venue-full", {
      status: "Deleted",
      id: 2,
      entityType: "venue",
      name: "Arcola Theatre",
      latitude: 1,
      longitude: 2,
      locationOptimized: {
        lat: 1,
        lon: 2
      }
    });

    await elasticsearch.indexDocument("event-series-full", {
      status: "Active",
      id: 1,
      entityType: "event-series",
      name: "Bang Said the Gun"
    });

    await elasticsearch.indexDocument("event-full", {
      status: "Active",
      id: 1,
      entityType: "event",
      name: "Andy Warhol: New York Start"
    });
  });

  afterAll(async () => {
    await elasticsearch.deleteIndex("talent-full");
    await elasticsearch.deleteIndex("venue-full");
    await elasticsearch.deleteIndex("event-full");
    await elasticsearch.deleteIndex("event-series-full");
  });

  it("should perform a public search of talents", async () => {
    const result = await request({
      uri:
        "http://localhost:3013/public/search/basic?term=carrie&entityType=talent",
      json: true,
      method: "GET",
      timeout: 30000
    });

    expect(result).toEqual({
      items: [
        {
          commonRole: "Director",
          entityType: "talent",
          firstNames: "Carrie",
          id: 1,
          lastName: "Cracknell",
          status: "Active"
        }
      ],
      params: {
        entityType: "talent",
        skip: 0,
        take: 12,
        term: "carrie",
        isPublic: true
      },
      total: 1
    });
  });

  it("should perform an admin search of venues", async () => {
    const result = await request({
      uri:
        "http://localhost:3013/admin/search/basic?term=theatre&entityType=venue",
      json: true,
      method: "GET",
      timeout: 30000
    });

    expect(result).toEqual({
      items: [
        {
          entityType: "venue",
          id: 1,
          name: "Almeida Theatre",
          status: "Active"
        },
        {
          entityType: "venue",
          id: 2,
          name: "Arcola Theatre",
          status: "Deleted",
          latitude: 1,
          longitude: 2
        }
      ],
      params: {
        entityType: "venue",
        isPublic: false,
        skip: 0,
        take: 12,
        term: "theatre"
      },
      total: 2
    });
  });

  it("should perform a public search of all venues", async () => {
    const result = await request({
      uri: "http://localhost:3013/public/search/basic?entityType=venue",
      json: true,
      method: "GET",
      timeout: 30000
    });

    expect(result).toEqual({
      items: [
        {
          entityType: "venue",
          id: 1,
          name: "Almeida Theatre",
          status: "Active"
        }
      ],
      params: {
        entityType: "venue",
        isPublic: true,
        skip: 0,
        take: 12
      },
      total: 1
    });
  });

  it("should perform a admin location search of venues", async () => {
    const result = await request({
      uri:
        "http://localhost:3013/admin/search/basic?entityType=venue&north=4&south=-4&east=4&west=-4",
      json: true,
      method: "GET",
      timeout: 30000
    });

    expect(result).toEqual({
      items: [
        {
          entityType: "venue",
          id: 2,
          name: "Arcola Theatre",
          status: "Deleted",
          latitude: 1,
          longitude: 2
        }
      ],
      params: {
        entityType: "venue",
        isPublic: false,
        location: { east: 4, north: 4, south: -4, west: -4 },
        skip: 0,
        take: 12
      },
      total: 1
    });
  });

  it("should perform a public search of all event series", async () => {
    const result = await request({
      uri: "http://localhost:3013/public/search/basic?entityType=event-series",
      json: true,
      method: "GET",
      timeout: 30000
    });

    expect(result).toEqual({
      items: [
        {
          entityType: "event-series",
          id: 1,
          name: "Bang Said the Gun",
          status: "Active"
        }
      ],
      params: {
        entityType: "event-series",
        isPublic: true,
        skip: 0,
        take: 12
      },
      total: 1
    });
  });

  it("should perform a public search of all events", async () => {
    const result = await request({
      uri: "http://localhost:3013/public/search/basic?entityType=event",
      json: true,
      method: "GET",
      timeout: 30000
    });

    expect(result).toEqual({
      items: [
        {
          entityType: "event",
          id: 1,
          name: "Andy Warhol: New York Start",
          status: "Active"
        }
      ],
      params: {
        entityType: "event",
        isPublic: true,
        skip: 0,
        take: 12
      },
      total: 1
    });
  });
});
