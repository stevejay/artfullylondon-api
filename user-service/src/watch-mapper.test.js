import * as watchMapper from "./watch-mapper";

describe("mapResponseForSingleWatchType", () => {
  it("should map a db item", () => {
    const dbItem = {
      entityType: "event",
      version: 1,
      items: [{ id: 1, label: "a", created: 1111 }]
    };

    const result = watchMapper.mapResponseForSingleWatchType("event", dbItem);
    expect(result).toEqual(dbItem);
  });

  it("should handle no db item", () => {
    const result = watchMapper.mapResponseForSingleWatchType("event", null);
    expect(result).toEqual({
      entityType: "event",
      version: 0,
      items: []
    });
  });
});

describe("mapResponseForAllWatchTypes", () => {
  it("should handle no db items", () => {
    const result = watchMapper.mapResponseForAllWatchTypes([]);
    expect(result).toEqual({
      watches: expect.arrayContaining([
        { entityType: "tag", version: 0, items: [] },
        { entityType: "talent", version: 0, items: [] },
        { entityType: "venue", version: 0, items: [] },
        { entityType: "event", version: 0, items: [] },
        { entityType: "event-series", version: 0, items: [] }
      ])
    });
  });

  it("should handle some db items", () => {
    const result = watchMapper.mapResponseForAllWatchTypes([
      {
        entityType: "event",
        version: 1,
        items: [{ id: 1, label: "a", created: 1111 }]
      }
    ]);
    expect(result).toEqual({
      watches: expect.arrayContaining([
        { entityType: "tag", version: 0, items: [] },
        { entityType: "talent", version: 0, items: [] },
        { entityType: "venue", version: 0, items: [] },
        {
          entityType: "event",
          version: 1,
          items: [{ id: 1, label: "a", created: 1111 }]
        },
        { entityType: "event-series", version: 0, items: [] }
      ])
    });
  });
});
